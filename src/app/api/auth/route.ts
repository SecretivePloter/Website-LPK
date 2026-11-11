import { NextResponse } from "next/server";
import {
  configured,
  cookieName,
  equal,
  sameOrigin,
  sessionToken,
} from "@/lib/auth";
// Global bounded throttle deliberately avoids trusting spoofable forwarding headers.
const attempts: number[] = [];
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Origin tidak diizinkan." },
      { status: 403 },
    );
  if (!configured())
    return NextResponse.json(
      {
        error:
          "Admin belum dikonfigurasi. Isi ADMIN_PASSWORD dan SESSION_SECRET pada server.",
      },
      { status: 503 },
    );
  while (attempts.length && attempts[0] < Date.now() - 60000) attempts.shift();
  if (attempts.length >= 10)
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi dalam satu menit." },
      { status: 429 },
    );
  attempts.push(Date.now());
  const body = await request.json().catch(() => null);
  if (
    typeof body?.password !== "string" ||
    !equal(body.password, process.env.ADMIN_PASSWORD!)
  )
    return NextResponse.json(
      { error: "Kata sandi tidak sesuai." },
      { status: 401 },
    );
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookieName, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 28800,
  });
  return response;
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.cookies.delete(cookieName);
  return response;
}
