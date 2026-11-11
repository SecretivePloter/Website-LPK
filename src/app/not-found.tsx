import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty">
      <h1>Halaman tidak ditemukan</h1>
      <Link className="button" href="/">
        Kembali ke Beranda ↗
      </Link>
    </main>
  );
}
