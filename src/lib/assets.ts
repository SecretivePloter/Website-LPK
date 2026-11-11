import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Asset } from "@/types/assets";
import seed from "../../data/assets.json";

export const dataDir = path.resolve(
  /* turbopackIgnore: true */ process.env.DATA_DIR || "./runtime-data",
);
export const mediaDir = path.join(dataDir, "media");
const manifest = path.join(dataDir, "assets.json");
let queue: Promise<unknown> = Promise.resolve();
export async function getAssets(): Promise<Asset[]> {
  try {
    return JSON.parse(await readFile(manifest, "utf8")) as Asset[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    return seed;
  }
}
// Serialize read-modify-write operations, then atomically replace the manifest.
export function changeAssets<T>(
  change: (assets: Asset[]) => T | Promise<T>,
): Promise<T> {
  const operation = queue.then(async () => {
    await mkdir(mediaDir, { recursive: true });
    const assets = await getAssets();
    const result = await change(assets);
    const temporary = `${manifest}.tmp`;
    await writeFile(temporary, JSON.stringify(assets, null, 2));
    await rename(temporary, manifest);
    return result;
  });
  queue = operation.catch(() => undefined);
  return operation;
}
