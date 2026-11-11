import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { changeAssets, getAssets, saveMedia } from "@/lib/assets";
import { isAdmin, sameOrigin } from "@/lib/auth";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json(await getAssets(), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function POST(request: Request) {
  if (!(await isAdmin()) || !sameOrigin(request))
    return NextResponse.json(
      { error: "Silakan login kembali." },
      { status: 401 },
    );
  if (Number(request.headers.get("content-length")) > 4.25 * 1024 * 1024)
    return NextResponse.json(
      { error: "Batas unggahan 4 MB." },
      { status: 413 },
    );
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 4 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    )
      throw new Error("Pilih JPG, PNG atau WebP maksimal 4 MB.");
    const id = randomUUID();
    const image = sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 25000000,
    });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || ""))
      throw new Error("Format gambar tidak didukung.");
    const buffer = await image
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const asset = {
      id,
      title: String(form.get("title") || file.name).slice(0, 150),
      alt: String(form.get("alt") || file.name).slice(0, 300),
      category: String(form.get("category") || "Sarana").slice(0, 80),
      src: `/media/${id}.webp`,
      slot: "",
      order: Date.now(),
      source: "Unggahan admin",
    };
    await saveMedia(`${id}.webp`, buffer);
    await changeAssets((assets) => {
      assets.push(asset);
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unggahan gagal." },
      { status: 400 },
    );
  }
}
