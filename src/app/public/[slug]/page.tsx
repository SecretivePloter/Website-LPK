import { notFound, redirect } from "next/navigation";
import { getAssets } from "@/lib/assets";
import { Website } from "@/components/sites/asahi/Website";
const titles: Record<string, string> = {
  about: "Tentang Kami",
  program: "Program",
  galeri: "Galeri",
  organization: "Struktur Organisasi",
  legalitas: "Legalitas",
  "privacy-policy": "Kebijakan Privasi",
  "terms-conditions": "Syarat & Ketentuan",
};
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: titles[slug] || "Home" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "public") redirect("/");
  if (slug === "gallery") redirect("/public/galeri");
  if (!titles[slug]) notFound();
  return <Website page={slug} assets={await getAssets()} />;
}
