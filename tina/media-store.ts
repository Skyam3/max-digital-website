// Custom Tina media store backed by Vercel Blob.
//
// TinaCMS has no official Vercel Blob adapter (unlike S3/Cloudinary/DO Spaces),
// so this implements the same MediaStore contract those adapters use
// (persist/list/delete + `accept`), talking to our own API route at
// src/app/api/tina-media/route.ts, which does the actual Vercel Blob calls.
//
// Instantiated by Tina as `new MediaClass(cms.api.tina)` — see setupMedia()
// in tinacms/dist/index.js — so the constructor receives the Tina API client,
// not the full cms instance. `client.authProvider.fetchWithToken` attaches the
// logged-in user's bearer token; `client.clientId` identifies the Tina Cloud
// project so the API route can verify that token against Tina Cloud.

interface TinaMediaItem {
  id: string;
  type: "file";
  filename: string;
  directory: string;
  src: string;
}

interface PersistFile {
  directory: string;
  file: File;
}

interface ListOptions {
  directory?: string;
  limit?: number;
  offset?: string | number;
}

interface TinaApiClient {
  clientId: string;
  authProvider: {
    fetchWithToken: (input: string, init?: RequestInit) => Promise<Response>;
  };
}

export default class VercelBlobMediaStore {
  accept = "image/*";
  private client: TinaApiClient;

  constructor(client: TinaApiClient) {
    this.client = client;
  }

  private async request(path: string, params: Record<string, string>, init?: RequestInit) {
    const query = new URLSearchParams({ clientID: this.client.clientId, ...params });
    const res = await this.client.authProvider.fetchWithToken(`${path}?${query}`, init);
    if (!res.ok) {
      throw new Error(`Vercel Blob media request failed (${res.status}): ${await res.text()}`);
    }
    return res;
  }

  async persist(files: PersistFile[]): Promise<TinaMediaItem[]> {
    const uploaded: TinaMediaItem[] = [];
    for (const { directory, file } of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("directory", directory || "");
      const res = await this.request("/api/tina-media", {}, { method: "POST", body: formData });
      uploaded.push(await res.json());
    }
    return uploaded;
  }

  async list(options: ListOptions = {}): Promise<{ items: TinaMediaItem[]; nextOffset?: string }> {
    const params: Record<string, string> = {};
    if (options.directory) params.directory = options.directory;
    if (options.offset) params.offset = String(options.offset);
    if (options.limit) params.limit = String(options.limit);
    const res = await this.request("/api/tina-media", params);
    return await res.json();
  }

  async delete(media: TinaMediaItem): Promise<void> {
    await this.request(
      "/api/tina-media",
      { filename: media.filename, directory: media.directory || "" },
      { method: "DELETE" }
    );
  }
}
