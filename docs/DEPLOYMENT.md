# Deployment Vercel

Produksi: https://website-lpk.vercel.app/

Proyek Vercel `website-lpk` terhubung ke `SecretivePloter/Website-LPK`, branch produksi `main`. Store Blob privat `website-lpk-assets` menyimpan manifest dan unggahan; credential koneksi dikelola oleh Vercel. Tidak ada credential dalam repository.

## Mengaktifkan admin

1. Buka proyek Vercel → Settings → Environment Variables.
2. Tambahkan `ADMIN_PASSWORD` sebagai Secret untuk **Production**, dengan kata sandi unik milik Anda.
3. `SESSION_SECRET` dan `APP_URL` telah dikonfigurasi pada proyek. Jangan menyalin secret ke kode atau mengirimkannya melalui chat.
4. Redeploy deployment produksi agar environment baru berlaku, kemudian buka https://website-lpk.vercel.app/admin.

Batas unggahan 4 MB agar di bawah batas request Functions Vercel. File tetap divalidasi dan dinormalisasi menjadi WebP. Manifest dibaca langsung dari origin Blob privat, dengan ETag/conditional write dan retry untuk mencegah overwrite perubahan antar instance. File gambar diteruskan melalui `/media/:name`; manifest Blob tidak dibuka publik. Penghapusan dari daftar tetap menyimpan file asli untuk pemulihan.

Mengganti domain memerlukan pembaruan `APP_URL` menjadi origin HTTPS baru dan redeploy. Pengaturan kata sandi tidak diperlukan agar halaman publik berfungsi. Uji lokal mencakup adapter disk; uji login/unggah Blob produksi perlu dilakukan setelah `ADMIN_PASSWORD` diisi.

## Menjalankan di server dengan disk persisten

## Pilihan yang didukung

Gunakan Node.js 24 dengan satu proses dan disk persisten, atau Docker Compose. Admin ini menulis ke filesystem sehingga jangan menjalankan beberapa replica, `pm2 -i max`, atau serverless ephemeral tanpa mengganti adapter penyimpanan. Tidak perlu Supabase atau API key untuk menjalankan versi ini.

## Node.js

```bash
npm ci
cp .env.example .env.local
# Edit .env.local menggunakan editor sendiri.
# ADMIN_PASSWORD: password unik
# SESSION_SECRET: hasil openssl rand -hex 32
# APP_URL: origin HTTPS yang digunakan pengunjung, tanpa path
# DATA_DIR: path absolut ke disk persisten, misalnya /var/lib/website-lpk
npm run check
npm run test:integration
npm start
```

Pasang reverse proxy HTTPS ke port 3000. Tetapkan batas request body sekitar 4.25 MB pada proxy. Pastikan origin `APP_URL` sama dengan URL akses admin. Cookie produksi Secure memerlukan HTTPS di browser. Batasi login di reverse proxy bila diperlukan. Jangan mengekspos port development ke publik.

Service manager harus menjalankan satu proses dengan working directory proyek dan izin tulis `DATA_DIR`. Jangan menggunakan user root untuk proses aplikasi. Simpan env di server dan jangan memasukkannya ke image, repo atau log.

## Docker Compose

```bash
cp .env.example .env.local
# Isi password, secret, dan APP_URL HTTPS.
docker compose up -d --build
docker compose logs --tail=100 app
```

Volume `lpk-media` dipasang pada `/app/runtime-data`. Volume harus writable oleh UID user `node` (1000). Saat volume baru dibuat Docker menyalin ownership direktori image. Jangan menjalankan `docker compose down -v` kecuali memang ingin membuang media dan manifest.

Build image Docker belum dijalankan pada lingkungan pengembangan ini; verifikasi container di host tujuan sebelum memakai data asli.

## Backup dan restore

Hentikan sementara penulisan admin atau hentikan aplikasi, salin seluruh `DATA_DIR`, kemudian mulai ulang. Seed `public/sites/asahi` dan kode harus dicadangkan melalui Git. Restore `assets.json` dan `media/` dari satu snapshot yang sama pada disk yang writable. File JSON rusak tidak akan ditimpa otomatis. Menghapus manifest akan mengembalikan daftar seed, bukan membaca unggahan lama secara otomatis.

## Peta

Leaflet mengambil tile publik OpenStreetMap pada browser. Atribusi ditampilkan. Untuk trafik tinggi gunakan penyedia tile dengan kapasitas dan ketentuan yang sesuai; ganti URL pada `Alumni.tsx`. Jika jaringan tile gagal, statistik, tombol kota, koordinat dan filter tetap berasal dari data lokal.

## Perintah pull request

Setelah branch `main` tersedia pada remote:

```bash
gh pr create --base main --head feat/asahi-website-admin --title "Build website LPK Asahi dan admin aset" --body-file docs/PR_DESCRIPTION.md
```

Tidak ada auto merge atau deployment hosting dalam implementasi ini.
