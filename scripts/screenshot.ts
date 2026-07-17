/**
 * Reusable screenshot tool, built on Playwright/Chromium.
 *
 * Usage:
 *   npm run screenshot -- <url> <output-path> [options]
 *
 * Options:
 *   --width=<px>       Viewport width (default: 1440 — desktop)
 *   --height=<px>      Viewport height (default: 900)
 *   --viewport-only    Capture only the visible viewport instead of the full
 *                       scrollable page (default: full page). Ignored when
 *                       --selector is set — element screenshots always
 *                       capture the whole element, full-page doesn't apply.
 *   --wait=<ms>        Extra delay after the page loads, before capturing
 *                       (default: 0). Useful for pages with entrance/reveal
 *                       animations that would otherwise be caught mid-fade.
 *   --scroll=<px>      Scroll down this many pixels before capturing (default:
 *                       0). Combine with --wait for content that lazy-loads
 *                       or animates in on scroll (e.g. IntersectionObserver).
 *                       Mainly useful without --selector, which scrolls the
 *                       target element into view on its own.
 *   --selector=<css>   Capture exactly one element (Playwright
 *                       locator(selector).screenshot()) instead of a
 *                       viewport/full-page crop — a clean, complete section
 *                       screenshot with no arbitrary crop edges. Takes
 *                       priority over --viewport-only/fullPage when set.
 *   --selector-all=<css>  Capture every element matching the selector (e.g.
 *                       "main > section") as its own numbered file:
 *                       <output>-01.png, <output>-02.png, ... Same
 *                       scroll-then-wait-then-capture as --selector, looped
 *                       per match. Takes priority over --selector.
 *
 * Examples:
 *   npm run screenshot -- http://localhost:3000/de public/portfolio/maksimtales.png
 *   npm run screenshot -- https://example.com out.png --width=1920 --viewport-only
 *   npm run screenshot -- http://localhost:3000 out.png --wait=1500
 *   npm run screenshot -- http://localhost:3000 out.png --scroll=800 --wait=1000 --viewport-only
 *   npm run screenshot -- http://localhost:3000 out.png --selector="#pricing" --wait=1000
 *   npm run screenshot -- http://localhost:3000 out.png --selector-all="main > section" --wait=1000
 */
import { mkdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { chromium, type Locator, type Page } from "playwright";

function parseArgs(argv: string[]) {
  const positional: string[] = [];
  let width = 1440;
  let height = 900;
  let fullPage = true;
  let wait = 0;
  let scroll = 0;
  let selector: string | undefined;
  let selectorAll: string | undefined;

  for (const arg of argv) {
    if (arg.startsWith("--width=")) {
      width = Number(arg.slice("--width=".length));
    } else if (arg.startsWith("--height=")) {
      height = Number(arg.slice("--height=".length));
    } else if (arg.startsWith("--wait=")) {
      wait = Number(arg.slice("--wait=".length));
    } else if (arg.startsWith("--scroll=")) {
      scroll = Number(arg.slice("--scroll=".length));
    } else if (arg.startsWith("--selector-all=")) {
      selectorAll = arg.slice("--selector-all=".length);
    } else if (arg.startsWith("--selector=")) {
      selector = arg.slice("--selector=".length);
    } else if (arg === "--viewport-only") {
      fullPage = false;
    } else if (!arg.startsWith("--")) {
      positional.push(arg);
    }
  }

  const [url, outputPath] = positional;
  return { url, outputPath, width, height, fullPage, wait, scroll, selector, selectorAll };
}

/** Inserts a zero-padded index before the extension: out.png, 1 -> out-01.png */
function indexedPath(outputPath: string, index: number): string {
  const ext = extname(outputPath);
  const base = outputPath.slice(0, outputPath.length - ext.length);
  const padded = String(index).padStart(2, "0");
  return `${base}-${padded}${ext}`;
}

/** Hides every currently fixed/sticky-positioned element (nav bars, "back
 * to top" buttons, ...) so they can't paint over the target element's own
 * edges in the captured pixels, and returns a restore function. Scroll-
 * position tricks to dodge these were tried first and abandoned: some
 * headers hide/reveal themselves on scroll direction, and the corrective
 * scroll itself would re-trigger the reveal before the shutter — a race
 * against an animation, not a fix. */
async function hideFixedOverlays(page: Page): Promise<() => Promise<void>> {
  const restore = await page.evaluate(() => {
    const changed: { el: HTMLElement; prevVisibility: string }[] = [];
    for (const el of document.querySelectorAll<HTMLElement>("body *")) {
      const style = getComputedStyle(el);
      if (style.position !== "fixed" && style.position !== "sticky") continue;
      changed.push({ el, prevVisibility: el.style.visibility });
      el.style.visibility = "hidden";
    }
    (window as unknown as { __restoreOverlays: typeof changed }).__restoreOverlays = changed;
    return changed.length;
  });
  return async () => {
    if (restore === 0) return;
    await page.evaluate(() => {
      const changed = (window as unknown as { __restoreOverlays: { el: HTMLElement; prevVisibility: string }[] })
        .__restoreOverlays;
      for (const { el, prevVisibility } of changed ?? []) {
        el.style.visibility = prevVisibility;
      }
    });
  };
}

/** Scrolls top-to-bottom once in steps before any capturing starts, so
 * every scroll-triggered reveal animation (Framer Motion `whileInView` and
 * similar, usually configured `once: true`) fires at least once. Landing
 * straight on a section via scrollIntoViewIfNeeded can skip right past the
 * viewport-margin threshold those observers watch for, leaving text stuck
 * at its pre-animation opacity — invisible, not just covered by something
 * else, which no amount of hiding overlays or nudging scroll position
 * afterwards fixes. Ends back at the top of the page. */
async function warmUpScrollAnimations(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

/** Scrolls so the element's top sits a small offset below the viewport
 * top — computed directly from its current bounding rect, not delegated
 * to scrollIntoViewIfNeeded(). That built-in only scrolls when it judges
 * the element "not visible enough" by its own heuristic, which on at
 * least one site landed the target 240px *above* the viewport (scrolled
 * past it entirely) after a page-level scroll-to-anchor script and a
 * scroll-reactive header interacted with it. A direct, deterministic
 * scrollTo sidesteps trusting that heuristic at all. */
async function scrollElementToTop(locator: Locator, offset = 24) {
  await locator.evaluate((el, offset) => {
    const rect = el.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    window.scrollTo(0, Math.max(0, absoluteTop - offset));
  }, offset);
}

/** Scroll into view *before* waiting, not after — content that mounts on
 * IntersectionObserver (reveal animations, lazy sections) needs to already
 * be in view when the wait starts, or it's still unmounted when captured. */
async function captureElement(locator: Locator, path: string, wait: number) {
  await scrollElementToTop(locator);
  if (wait > 0) await locator.page().waitForTimeout(wait);
  // The wait can give a scroll-reactive header time to animate back in
  // (see scrollElementToTop) — re-assert position right before capturing.
  await scrollElementToTop(locator);

  // locator.screenshot() only reliably renders what's within the *current*
  // viewport, even though it captures the element's full logical height —
  // content past the viewport's bottom edge came back blank in testing,
  // no matter how long we waited or scrolled. Grow the viewport to fit the
  // whole element first, then put it back.
  const page = locator.page();
  const originalViewport = page.viewportSize();
  const box = await locator.boundingBox();
  if (originalViewport && box && box.height > originalViewport.height) {
    await page.setViewportSize({ width: originalViewport.width, height: Math.ceil(box.height) + 48 });
    await scrollElementToTop(locator);
    // The resize itself can trigger a relayout that re-picks a responsive
    // image's srcset and re-fetches it (e.g. next/image) — give that a
    // moment before capturing, or it's blank again for a different reason.
    // 500ms wasn't reliably enough in testing; 2s was.
    await page.waitForTimeout(2000);
  }

  const restoreOverlays = await hideFixedOverlays(locator.page());
  try {
    await locator.screenshot({ path });
  } finally {
    await restoreOverlays();
    if (originalViewport && box && box.height > originalViewport.height) {
      await page.setViewportSize(originalViewport);
    }
  }
}

async function main() {
  const { url, outputPath, width, height, fullPage, wait, scroll, selector, selectorAll } = parseArgs(
    process.argv.slice(2)
  );

  if (!url || !outputPath) {
    console.error(
      "Usage: npm run screenshot -- <url> <output-path> [--width=1440] [--height=900] [--viewport-only] [--wait=ms] [--scroll=px] [--selector=css] [--selector-all=css]"
    );
    process.exitCode = 1;
    return;
  }

  const resolvedOutput = resolve(outputPath);
  await mkdir(dirname(resolvedOutput), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page: Page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: "networkidle" });
    if (selector || selectorAll) await warmUpScrollAnimations(page);

    if (selectorAll) {
      const count = await page.locator(selectorAll).count();
      if (count === 0) {
        console.error(`No elements matched selector "${selectorAll}"`);
        process.exitCode = 1;
        return;
      }
      for (let i = 0; i < count; i++) {
        const path = indexedPath(resolvedOutput, i + 1);
        await captureElement(page.locator(selectorAll).nth(i), path, wait);
        console.log(`Saved element screenshot ${i + 1}/${count}: ${path}`);
      }
      return;
    }

    if (selector) {
      await captureElement(page.locator(selector), resolvedOutput, wait);
      console.log(`Saved element screenshot: ${resolvedOutput} (selector "${selector}", ${width}px viewport)`);
      return;
    }

    if (scroll > 0) await page.evaluate((y) => window.scrollTo(0, y), scroll);
    if (wait > 0) await page.waitForTimeout(wait);
    await page.screenshot({ path: resolvedOutput, fullPage });
    console.log(`Saved screenshot: ${resolvedOutput} (${width}x${height}, ${fullPage ? "full page" : "viewport only"})`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
