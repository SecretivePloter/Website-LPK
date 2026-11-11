import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { BlobError, BlobPreconditionFailedError, get, put } from "@vercel/blob";
import type { Asset } from "@/types/assets";
import seed from "../../data/assets.json";

export const dataDir = path.resolve(
  /* turbopackIgnore: true */ process.env.DATA_DIR || "./runtime-data",
);
export const mediaDir = path.join(dataDir, "media");
const manifest = path.join(dataDir, "assets.json");
const blobManifest = "website-lpk/assets.json";
const blobEnabled = () =>
  Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
let queue: Promise<unknown> = Promise.resolve();

async function snapshot(): Promise<{ assets: Asset[]; etag?: string }> {
  if (blobEnabled()) {
    const result = await get(blobManifest, {
      access: "private",
      useCache: false,
    });
    if (!result) return { assets: structuredClone(seed) };
    if (result.statusCode !== 200)
      throw new Error("Tidak dapat membaca daftar aset.");
    return {
      assets: (await new Response(result.stream).json()) as Asset[],
      etag: result.blob.etag,
    };
  }
  try {
    return { assets: JSON.parse(await readFile(manifest, "utf8")) as Asset[] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return { assets: structuredClone(seed) };
  }
}
export async function getAssets(): Promise<Asset[]> {
  return (await snapshot()).assets;
}

// Callbacks must only mutate metadata. Blob retries replay them after a conflict.
export function changeAssets<T>(
  change: (assets: Asset[]) => T | Promise<T>,
): Promise<T> {
  const operation = queue.then(async () => {
    if (process.env.VERCEL && !blobEnabled())
      throw new Error("Penyimpanan Blob belum terhubung.");
    for (let attempt = 0; attempt < 5; attempt++) {
      const { assets, etag } = await snapshot();
      const result = await change(assets);
      if (blobEnabled()) {
        try {
          await put(blobManifest, JSON.stringify(assets), {
            access: "private",
            addRandomSuffix: false,
            contentType: "application/json",
            allowOverwrite: Boolean(etag),
            ...(etag ? { ifMatch: etag } : {}),
            cacheControlMaxAge: 60,
          });
          return result;
        } catch (error) {
          const conflict =
            error instanceof BlobPreconditionFailedError ||
            (error instanceof BlobError &&
              /already exists/i.test(error.message));
          if (!conflict || attempt === 4) throw error;
        }
      } else {
        await mkdir(mediaDir, { recursive: true });
        await writeFile(`${manifest}.tmp`, JSON.stringify(assets, null, 2));
        await rename(`${manifest}.tmp`, manifest);
        return result;
      }
    }
    throw new Error("Daftar aset sedang diperbarui. Silakan coba lagi.");
  });
  queue = operation.catch(() => undefined);
  return operation;
}
export async function saveMedia(name: string, buffer: Buffer) {
  if (blobEnabled()) {
    await put(`website-lpk/media/${name}`, buffer, {
      access: "private",
      addRandomSuffix: false,
      contentType: "image/webp",
    });
  } else {
    if (process.env.VERCEL)
      throw new Error("Penyimpanan Blob belum terhubung.");
    await mkdir(mediaDir, { recursive: true });
    await writeFile(path.join(mediaDir, name), buffer);
  }
}
export async function readMedia(
  name: string,
): Promise<ReadableStream<Uint8Array> | ArrayBuffer | null> {
  if (blobEnabled()) {
    const result = await get(`website-lpk/media/${name}`, {
      access: "private",
    });
    return result?.statusCode === 200 ? result.stream : null;
  }
  try {
    return new Uint8Array(await readFile(path.join(mediaDir, name))).buffer;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
