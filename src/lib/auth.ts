import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export const cookieName = "lpk-admin";
function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}
export function configured() {
  return (
    !!process.env.ADMIN_PASSWORD &&
    (process.env.SESSION_SECRET?.length || 0) >= 32
  );
}
export function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function sessionToken() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}
export async function isAdmin() {
  if (!configured()) return false;
  const token = (await cookies()).get(cookieName)?.value || "";
  const [expires, signature] = token.split(".");
  return (
    !!signature &&
    Number(expires) > Date.now() &&
    equal(signature, sign(expires))
  );
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return (
    !!origin && origin === new URL(process.env.APP_URL || request.url).origin
  );
}
