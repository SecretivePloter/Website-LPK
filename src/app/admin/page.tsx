import type { Metadata } from "next";
import { getAssets } from "@/lib/assets";
import { isAdmin } from "@/lib/auth";
import { AssetAdmin } from "@/components/sites/asahi/AssetAdmin";
export const metadata: Metadata = {
  title: "Admin Aset",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Admin() {
  const authenticated = await isAdmin();
  return (
    <AssetAdmin
      authenticated={authenticated}
      initialAssets={authenticated ? await getAssets() : []}
    />
  );
}
