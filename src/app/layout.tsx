import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Home - LPK Asahi Nusantara",
    template: "%s - LPK Asahi Nusantara",
  },
  description:
    "Diklat bahasa & budaya Jepang untuk persiapan berkarir di Jepang. Informasi program, profil, fasilitas, dan galeri LPK Asahi Nusantara.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
