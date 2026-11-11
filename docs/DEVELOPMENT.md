# Panduan pengembangan

## Struktur

```text
src/app/                       Routing Next.js App Router
  page.tsx                     Beranda
  public/[slug]/page.tsx        Halaman publik dan metadata per halaman
  admin/page.tsx               Pemeriksaan sesi sebelum admin dirender
  api/auth/route.ts            Login/logout
  api/assets/route.ts          Daftar aset dan unggah
  api/assets/[id]/route.ts     Edit dan hapus metadata
  media/[name]/route.ts        File unggahan yang sudah dinormalisasi
src/components/sites/asahi/
  Website.tsx                  Shell, navigasi, footer, halaman publik
  Alumni.tsx                   Peta Leaflet dan statistik/filter
  AssetAdmin.tsx               Login, unggah, cari, edit dan hapus
  Modal.tsx                    Dialog native dengan Escape dan fokus browser
  admin.css                    Gaya khusus admin
src/lib/assets.ts              Repositori JSON dengan antrian tulis atomik
src/lib/auth.ts                Token HMAC, cookie, validasi origin
src/types/assets.ts            Kontrak Asset
src/app/globals.css            Font, token desain dan responsive layout
public/sites/asahi/            Gambar seed dan font lokal
  poppins-*.ttf                Font Poppins dari Google Fonts
data/assets.json               Metadata seed, tidak dimutasi saat runtime
data/programs.json             Nama, kategori dan deskripsi program referensi
data/placements.json           Data kota, koordinat, jumlah alumni, tahun
data/sources.json              Asal gambar seed
runtime-data/                  Dibuat saat pertama kali admin menulis
```

## Aliran data

Server membaca manifest `DATA_DIR/assets.json`. Bila file belum ada, server menggunakan `data/assets.json`. Halaman publik dirender dinamis supaya perubahan aset tampak saat halaman dimuat ulang. Admin tidak memakai localStorage.

Unggah memvalidasi sesi dan origin, menerima JPG/PNG/WebP maksimum 8 MB dan 25 juta pixel. Sharp memeriksa isi, memperbaiki orientasi, membatasi lebar 2400 px dan mengubahnya menjadi WebP. Nama file UUID menghindari nama/path kiriman pengguna. SVG dan dokumen tidak didukung.

Penulisan manifest memakai antrian proses dan rename atomik. Ini melindungi perubahan bersamaan pada satu proses. Untuk beberapa replica, pindahkan repositori ini ke database transaksi dan object storage, kemudian pertahankan kontrak `Asset` serta URL `/media` atau CDN.

## Mengubah konten

- Menu dan konten halaman: `Website.tsx`; `nav` mengatur menu header/footer.
- Deskripsi pekerjaan: `data/programs.json`. Properti `assetId` harus sesuai slot `program-ID` pada aset.
- Alumni: `data/placements.json`. `accepted` angka, `lat`/`lng` koordinat, `year` angka atau null. Statistik dihitung ulang dari data, bukan ditulis manual.
- Warna dan ukuran: custom properties di awal `globals.css`; breakpoint 1000 dan 700 px, galeri desktop empat kolom.
- Halaman baru: tambah slug terdaftar di `src/app/public/[slug]/page.tsx`, metadata, dan render konten pada `Website.tsx`; gunakan route terpisah untuk modul besar.

## Kontrak API

| Method | Endpoint | Otorisasi | Isi |
| --- | --- | --- | --- |
| GET | `/api/assets` | Publik | Array metadata aset publik; jangan simpan informasi rahasia pada field aset |
| POST | `/api/auth` | Origin sama | JSON `{password}`; mengatur cookie HttpOnly |
| DELETE | `/api/auth` | Origin sama | Menghapus cookie |
| POST | `/api/assets` | Admin + origin sama | FormData `file`, `title`, `alt`, `category` |
| PATCH | `/api/assets/:id` | Admin + origin sama | JSON `title`, `alt`, `category`, `slot`, `order` |
| DELETE | `/api/assets/:id` | Admin + origin sama | Ditolak 409 bila masih ditempatkan |
| GET | `/media/:name` | Publik | WebP, nama UUID valid |

Slot yang sama hanya boleh dimiliki satu aset. PATCH yang memilih slot aktif akan melepaskan slot aset lama. `src`, `id`, dan `source` tidak dapat diubah lewat PATCH. Respons kegagalan JSON menggunakan `{error}` dan status HTTP yang sesuai.

## Keamanan sesi

Password dan secret hanya pada server. Cookie ditandatangani HMAC-SHA256, berlaku 8 jam, SameSite Strict, HttpOnly, Secure pada produksi. Origin mutation harus persis `APP_URL`. Login dibatasi 10 percobaan per menit per proses. Pembatasan global sengaja tidak mempercayai header IP arbitrer; gunakan rate limit reverse proxy untuk produksi yang lebih besar. Rotasi `SESSION_SECRET` membatalkan semua sesi. Logout menghapus cookie browser; tidak ada registry sesi atau pencabutan token individual.

Admin hanya mengelola gambar. Pengelolaan teks program, akun multiuser, pendaftaran siswa, pembayaran dan editor alumni tidak termasuk fitur admin saat ini.

## Konvensi

TypeScript strict, komponen bernama PascalCase, data terpisah dari JSX. CSS tanpa library animasi tambahan. Hormati `prefers-reduced-motion`. Tidak ada HTML mentah dari admin; React meng-escape judul dan alt. Jalankan check dan uji integrasi setelah perubahan API/persistensi.
