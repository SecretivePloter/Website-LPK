# Catatan referensi

Inspeksi 11 November 2026. Referensi utama: https://lpkasahinusantara.com/ dan dokumen unggahan `Home - LPK Asahi Nusantara.md`.

## Pemetaan

| Sumber | Lokal | Pemilik implementasi |
| --- | --- | --- |
| `/`, `/public`, `/public/public` | `/` | `src/app/page.tsx`, `Website.tsx`, `Alumni.tsx` |
| `/public/about` | sama | `public/[slug]/page.tsx`, `Website.tsx` |
| `/public/program` | sama | komponen website dan `data/programs.json` |
| `/public/galeri`, `/public/gallery` | `/public/galeri` | komponen website dan manifest aset |
| `/public/organization` | sama | komponen website dan slot team |
| tautan legalitas/kebijakan | path yang sama | penanda data belum tersedia dan kontak |
| tidak ada pada lingkup publik sumber | `/admin` | `AssetAdmin.tsx`, API, adapter persistensi |

## Yang diamati

Header kapsul putih di atas hero biru muda, font Poppins, teks Jepang, ilustrasi profesi dan CTA. Beranda berurutan: hero, profil dua gambar, keunggulan pada latar hitam, dua baris fasilitas bergerak, statistik/peta alumni, filter tahun, footer empat kolom dengan latar biru. Navigasi menghubungkan lima halaman utama dan drawer kontak.

Program memakai kartu horizontal dan detail modal. Galeri sumber memakai empat kolom desktop, filter kategori dan lightbox. Profil sumber adalah artikel lebar dengan gambar utama serta blok kutipan visi/misi/motto. Organisasi memisahkan pembina/penasihat dari tim pelaksana.

Warna utama: teks cokelat gelap, biru `#1b4578`, biru muda `#c5d6e1`, latar hangat `#f8f4f0`. Hero disusun ulang sebagai HTML/CSS dan gambar terpisah, bukan screenshot halaman atau iframe situs asal.

## Media dan konten

Logo, latar hero, ilustrasi profesi diambil dari referensi untuk mempertahankan identitas visual. Foto stok dari Unsplash disimpan lokal; URL asal ada di `data/sources.json`. Satu foto stok yang gagal diunduh diganti foto kelas lain yang berhasil. Potret tim adalah ilustrasi, bukan identitas asli. Font Poppins disimpan lokal dan lisensinya ada di direktori font.

Nama dan deskripsi program, 30 kota penempatan dan metadata galeri mengikuti data sumber pada saat inspeksi. Jumlah alumni dihitung dari `placements.json` (139 pada seluruh tahun). Item demo “Tes”, “Asahi”, “tes” di data program dipertahankan agar tidak menghilangkan entri sumber; pengelola sebaiknya meninjaunya sebelum peluncuran.

## Perbedaan dan batas validasi

- Foto diganti foto stok sesuai instruksi pengguna. Dengan demikian tidak identik pada level pixel.
- Header, bagian halaman, warna, font, isi dan interaksi dibangun ulang; ukuran mikro, ikon dekoratif dan animasi reveal belum diverifikasi dengan perbandingan browser lokal pada ukuran yang sama.
- Browser referensi memperlihatkan beberapa section kosong sebelum scroll/reveal. Implementasi menampilkan kontennya langsung, tidak menyalin kondisi pemuatan kosong tersebut.
- Halaman legalitas, privacy-policy, terms-conditions sumber mengembalikan 404. Isi kebijakan tidak dibuat-buat; legalitas hanya memakai nomor yang tersedia di footer sumber.
- Galeri lokal memakai muat lebih banyak untuk membatasi jumlah kartu awal, sedangkan sumber memasang seluruh kartu.
- Data peta menggunakan koordinat/jumlah asli, dengan tile OpenStreetMap menggantikan tile referensi yang menampilkan pesan API key.
- Info kontak pribadi anggota tidak disalin. Modal menampilkan jabatan dan catatan biografi belum tersedia.
- Admin merupakan fitur tambahan, bukan replika admin internal sumber.
- Belum ada klaim pixel-perfect. Perlu uji visual desktop/mobile di browser yang dapat menjangkau server ini sebelum menyetujui kesamaan final.
