# Website LPK Asahi Nusantara

Rekonstruksi website https://lpkasahinusantara.com/ dengan Next.js 16, React 19, TypeScript dan admin aset gambar. Dikembangkan dari [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template), commit `5426e0e2ec35dbc173a7a18f47a3dfe2a765313e`. Lisensi MIT template dipertahankan di `LICENSE`.

## Menjalankan

Jika menggunakan arsip ZIP, ekstrak ke sebuah folder dan mulai dari langkah `npm ci`. Perintah clone di bawah berlaku setelah branch sudah tersimpan pada remote.

Node.js 24+ dan npm diperlukan.

```bash
git clone -b feat/asahi-website-admin https://github.com/SecretivePloter/Website-LPK.git
cd Website-LPK
npm ci
cp .env.example .env.local
openssl rand -hex 32
```

Isi `ADMIN_PASSWORD` dengan kata sandi sendiri dan `SESSION_SECRET` dengan hasil perintah terakhir. Jangan commit `.env.local`. Tetapkan `APP_URL=http://localhost:3000` untuk lokal.

```bash
npm run dev
```

Website: `http://localhost:3000`. Admin: `http://localhost:3000/admin`. Tidak ada kata sandi bawaan. Admin menolak login sampai konfigurasi lengkap.

```bash
npm run check             # lint, TypeScript, build produksi
npm run test:integration  # API dan lifecycle aset; jalankan setelah build
npm start                 # server produksi setelah npm run build
```

## Halaman dan fitur

| URL | Isi |
| --- | --- |
| `/` | Hero, profil, tab keunggulan, galeri fasilitas bergerak, peta alumni dan filter tahun |
| `/public/about` | Profil, bidang, visi, misi, motto |
| `/public/program` | Magang dan Tokutei Ginou; kartu horizontal dengan modal detail |
| `/public/galeri` | Filter kategori, muat lebih banyak, lightbox dengan navigasi |
| `/public/organization` | Pembina/penasihat dan tim pelaksana dengan modal detail |
| `/public/legalitas` | Nomor legalitas dari referensi, kontak permintaan dokumen |
| `/public/privacy-policy`, `/public/terms-conditions` | Penanda isi resmi belum tersedia, tanpa mengarang kebijakan |
| `/admin` | Login dan manajemen aset |

Alias `/public` dan `/public/public` mengarah ke beranda; `/public/gallery` mengarah ke galeri.

Foto stok adalah ilustrasi, termasuk potret anggota organisasi. Jangan menganggap potret sebagai foto orang yang tercantum. Logo dan ilustrasi hero mengikuti referensi. Hak merek, foto, dan konten referensi tetap milik pemiliknya. Ganti foto stok dengan dokumentasi lembaga sebelum digunakan sebagai representasi resmi.

## Dokumentasi

- [Arsitektur dan pengembangan](docs/DEVELOPMENT.md)
- [Panduan admin aset](docs/ADMIN.md)
- [Deployment dan cadangan](docs/DEPLOYMENT.md)
- [Pemetaan referensi dan batas kesamaan](docs/research/asahi/REFERENCE.md)
- [Validasi](docs/VALIDATION.md)

## Penyimpanan

Metadata dan unggahan admin tersimpan di `DATA_DIR`, default `runtime-data/`. Folder ini harus berada pada disk persisten. Implementasi JSON ini untuk **satu proses Node.js**, bukan beberapa replica atau filesystem serverless sementara. Peta mengambil tile OpenStreetMap melalui browser; gambar dan font situs tersedia lokal.

Tidak ada deployment hosting yang dilakukan oleh perubahan kode ini.
