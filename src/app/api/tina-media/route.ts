import { del, list, put } from "@vercel/blob";
import { isUserAuthorized } from "@tinacms/auth";
import { NextRequest, NextResponse } from "next/server";

// Backend for tina/media-store.ts (Vercel Blob). Every request must prove it
// came from a logged-in Tina Cloud user for this project — otherwise anyone
// who finds this URL could read/write/delete site media. In local dev there
// is no Tina Cloud session (`tinacms dev` runs against the local filesystem
// API), so auth is skipped there, matching Tina's own documented pattern for
// external media handlers.
async function authorize(req: NextRequest): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;

  const clientID = req.nextUrl.searchParams.get("clientID");
  const token = req.headers.get("authorization");
  if (!clientID || !token) return false;

  try {
    const user = await isUserAuthorized({ clientID, token });
    return Boolean(user?.verified);
  } catch {
    return false;
  }
}

function sanitizeDirectory(directory: string): string {
  return directory
    .split("/")
    .filter((segment) => segment && segment !== "." && segment !== "..")
    .join("/");
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[/\\]/g, "_");
}

function toMediaItem(pathname: string, url: string) {
  const slashIndex = pathname.lastIndexOf("/");
  return {
    id: pathname,
    type: "file" as const,
    filename: slashIndex === -1 ? pathname : pathname.slice(slashIndex + 1),
    directory: slashIndex === -1 ? "" : pathname.slice(0, slashIndex),
    src: url,
  };
}

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const directory = sanitizeDirectory(req.nextUrl.searchParams.get("directory") || "");
  const limit = Number(req.nextUrl.searchParams.get("limit")) || undefined;
  const cursor = req.nextUrl.searchParams.get("offset") || undefined;

  const { blobs, cursor: nextCursor } = await list({
    prefix: directory ? `${directory}/` : undefined,
    limit,
    cursor,
  });

  return NextResponse.json({
    items: blobs.map((blob) => toMediaItem(blob.pathname, blob.url)),
    nextOffset: nextCursor,
  });
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const directory = sanitizeDirectory((formData.get("directory") as string) || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const filename = sanitizeFilename(file.name);
  const pathname = [directory, filename].filter(Boolean).join("/");

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json(toMediaItem(blob.pathname, blob.url));
}

export async function DELETE(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const directory = sanitizeDirectory(req.nextUrl.searchParams.get("directory") || "");
  const filename = req.nextUrl.searchParams.get("filename");
  if (!filename) {
    return NextResponse.json({ error: "Missing filename" }, { status: 400 });
  }

  const pathname = [directory, sanitizeFilename(filename)].filter(Boolean).join("/");
  await del(pathname);

  return NextResponse.json({ ok: true });
}
