import { getAssets } from "@/lib/assets";
import { Website } from "@/components/sites/asahi/Website";
export const dynamic = "force-dynamic";
export default async function Home() {
  return <Website page="home" assets={await getAssets()} />;
}
