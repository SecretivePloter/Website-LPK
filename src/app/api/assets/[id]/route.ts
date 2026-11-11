import { NextResponse } from "next/server";
import { changeAssets } from "@/lib/assets";
import { isAdmin, sameOrigin } from "@/lib/auth";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin()) || !sameOrigin(request))
    return new Response(null, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.title !== "string" ||
    typeof body.alt !== "string" ||
    typeof body.category !== "string" ||
    typeof body.slot !== "string" ||
    !Number.isFinite(body.order)
  )
    return NextResponse.json(
      { error: "Data aset tidak valid." },
      { status: 400 },
    );
  const result = await changeAssets((assets) => {
    const asset = assets.find((a) => a.id === id);
    if (!asset) return null;
    const slot = body.slot.slice(0, 100);
    if (slot)
      assets.forEach((a) => {
        if (a.slot === slot) a.slot = "";
      });
    Object.assign(asset, {
      title: body.title.slice(0, 150),
      alt: body.alt.slice(0, 300),
      category: body.category.slice(0, 80),
      slot,
      order: body.order,
    });
    return asset;
  });
  return NextResponse.json(result || { error: "Aset tidak ditemukan." }, {
    status: result ? 200 : 404,
  });
}
export async function DELETE(request: Request, context: Context) {
  if (!(await isAdmin()) || !sameOrigin(request))
    return new Response(null, { status: 401 });
  const { id } = await context.params;
  const result = await changeAssets((assets) => {
    const index = assets.findIndex((a) => a.id === id);
    if (index < 0) return "missing";
    if (assets[index].slot) return "used";
    assets.splice(index, 1);
    // Keep original file for backup recovery; manifest deletion removes public listing.
    return "ok";
  });
  return NextResponse.json(
    {
      error:
        result === "used"
          ? "Lepaskan penempatan aset sebelum menghapus."
          : undefined,
    },
    { status: result === "used" ? 409 : result === "missing" ? 404 : 200 },
  );
}
