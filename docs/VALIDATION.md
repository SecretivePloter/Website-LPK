# Validasi implementasi

Dilakukan 11 November 2026 menggunakan Node.js 24.22.1.

| Pemeriksaan | Hasil |
| --- | --- |
| `npm run lint` | Lulus |
| `npm run typecheck` | Lulus |
| `npm run build` | Lulus, seluruh route terkompilasi |
| `npm run test:integration` | Lulus, 1 skenario integrasi dengan seluruh lifecycle di bawah |
| Docker image build | Belum dijalankan |
| Visual browser desktop/mobile lokal | Belum tervalidasi; browser tidak dapat menjangkau server lokal |

Uji integrasi menyalakan build produksi dengan direktori sementara dan credential acak, kemudian memeriksa halaman publik/admin, 404, akses tanpa login, origin asing, password salah, cookie HttpOnly, penolakan SVG, unggah JPG ke WebP, penggantian slot profil, respons gambar, larangan menghapus aset yang dipakai, render referensi aset baru, restart server dan persistensi manifest/media, penolakan sesi dengan secret lama, pelepasan slot, penghapusan dari daftar dan logout.

Server uji menggunakan hostname 127.0.0.1 karena runtime ini tidak mengizinkan enumerasi network interface yang dilakukan Next.js bila hostname tidak ditentukan. Direktori data uji dibuang setelah selesai; data seed repo tidak dimutasi.

Browser berhasil dipakai mengamati situs referensi. Browser berada pada lingkungan berbeda dan menolak koneksi `localhost` ke server implementasi. Render statis tidak dapat dibuka karena browser hanya mengizinkan HTTP/HTTPS. Karena itu tidak tersedia screenshot perbandingan hasil lokal dan tidak diklaim identik pada level pixel.

## Pemeriksaan sebelum peluncuran

Buka localhost atau staging HTTPS yang dapat dijangkau browser pada lebar 390, 768, 1366, dan 1920 px. Periksa seluruh halaman, wrapping judul, menu mobile, tab keunggulan, carousel horizontal program, modal Escape/fokus, gallery filter dan navigasi lightbox, hover/focus, reduced motion, peta/zoom/tahun, login/upload/edit/delete/logout. Pastikan tidak ada horizontal overflow halaman (selain area carousel), gambar rusak, console error atau komponen bertabrakan.

Ganti foto stok, konfirmasi konten program demo dan dokumen legal, kemudian verifikasi admin melalui HTTPS dan backup/restore disk persisten pada host tujuan.
