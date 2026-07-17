// Custom Tina field for the `src` half of a { src, width, height } image
// group. Wraps the same media-picker flow as Tina's built-in "image" field
// (cms.media.open / cms.media.persist), but additionally loads the picked
// image in the browser to read its real naturalWidth/naturalHeight and
// writes those into the sibling `width`/`height` fields automatically —
// so editors never have to type pixel dimensions by hand, and the
// portfolio carousels' aspect-ratio layout always matches the real file.
import { useState } from "react";
import { useCMS, wrapFieldsWithMeta, type Media } from "tinacms";

function probeImageSize(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error(`Could not load image to read its dimensions: ${src}`));
    img.src = src;
  });
}

/** `field.name` is the full dot path to the `src` field (e.g.
 * "Portfolio.projects.0.images.2.src") — its `width`/`height` siblings
 * live at the same path with the last segment swapped. */
function siblingPath(srcFieldName: string, sibling: "width" | "height") {
  return srcFieldName.replace(/\.[^.]+$/, `.${sibling}`);
}

interface SizedImageFieldProps {
  input: { value: string; onChange: (value: string) => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches @tinacms/schema-tools's own `uploadDir` signature exactly
  field: { name: string; uploadDir?: (formValues: Record<string, any>) => string };
  // The `form` prop Tina's FieldsBuilder passes down is `form.finalForm` —
  // the react-final-form API, which is what actually exposes .change()/.getState().
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches @tinacms/schema-tools's own `uploadDir` signature exactly
  form: { change: (name: string, value: unknown) => void; getState: () => { values: Record<string, any> } };
}

function SizedImageFieldInner(props: SizedImageFieldProps) {
  const cms = useCMS();
  const { input, field, form } = props;
  const src = input.value;
  const [isBusy, setIsBusy] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  async function applyMedia(media: Media) {
    const parse = cms?.media?.store?.parse;
    const parsedSrc = typeof parse === "function" ? parse(media) : media.src || "";
    input.onChange(parsedSrc);
    setSizeError(false);
    try {
      const { width, height } = await probeImageSize(parsedSrc);
      form.change(siblingPath(field.name, "width"), width);
      form.change(siblingPath(field.name, "height"), height);
    } catch {
      // Dimensions stay whatever they were — surfaced so the editor knows
      // to check the width/height fields below instead of silently
      // shipping a stale aspect ratio.
      setSizeError(true);
    }
  }

  function openPicker() {
    const directory = field.uploadDir?.(form.getState().values) ?? "";
    cms.media.open({
      allowDelete: true,
      directory,
      onSelect: (media: Media) => applyMedia(media),
    });
  }

  async function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    setIsBusy(true);
    try {
      const directory = field.uploadDir?.(form.getState().values) ?? "";
      const [media] = await cms.media.persist([{ directory, file }]);
      if (media) await applyMedia(media);
    } catch (error) {
      cms.alerts.error("Bild-Upload fehlgeschlagen.");
      console.error(error);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      {src ? (
        <div style={{ position: "relative" }}>
          {/* Tina's admin UI is a separate Vite bundle outside the Next.js app — next/image doesn't apply here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 6, border: "1px solid #edecf3", display: "block" }}
          />
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={openPicker}
          disabled={isBusy}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #edecf3",
            background: "#f6f6f9",
            cursor: isBusy ? "wait" : "pointer",
            fontSize: 13,
          }}
        >
          {isBusy ? "Lädt hoch…" : src ? "Bild ersetzen" : "Bild wählen"}
        </button>
        {src && (
          <button
            type="button"
            onClick={() => input.onChange("")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #edecf3",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              color: "#e50051",
            }}
          >
            Entfernen
          </button>
        )}
      </div>
      {sizeError && (
        <p style={{ fontSize: 12, color: "#e50051", margin: 0 }}>
          Bildgröße konnte nicht automatisch gelesen werden — bitte Breite/Höhe unten manuell prüfen.
        </p>
      )}
    </div>
  );
}

export const SizedImageField = wrapFieldsWithMeta(SizedImageFieldInner);
