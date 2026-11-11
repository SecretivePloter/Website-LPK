# Panduan admin gambar

1. Pengelola server mengisi `.env.local`, lalu memulai ulang server. Buka `/admin` dan masuk dengan `ADMIN_PASSWORD`.
2. Unggah JPG, PNG atau WebP maksimal 8 MB. Isi judul, alt yang menjelaskan gambar, dan kategori. Server mengubah file menjadi WebP.
3. Gunakan pencarian atau filter kategori untuk menemukan aset. Klik **Edit / Tempatkan**.
4. Ubah judul, teks alternatif, kategori dan urutan. Angka urutan lebih kecil tampil lebih awal.
5. Pilih penempatan dan simpan. Muat ulang halaman publik untuk melihat perubahan.
6. Untuk menghapus aset, lepaskan penempatan dahulu. Penghapusan mengeluarkan aset dari manifest/galeri; file unggahan tetap disimpan untuk pemulihan cadangan.

## Penempatan

| Slot | Fungsi |
| --- | --- |
| `logo` | Header, drawer dan footer; pakai PNG transparan atau WebP |
| `hero-background` | Latar hero; gunakan gambar landscape lebar |
| `hero-art` | Ilustrasi sisi kanan hero; transparansi didukung |
| `profile` | Foto utama di beranda dan halaman profil |
| `profile-small` | Foto kecil beranda |
| `footer` | Latar footer di balik lapisan biru |
| `facility-0` sampai `facility-7` | Delapan fasilitas bergerak di beranda |
| `program-ID` | Kartu program dengan ID dari `data/programs.json` |
| `team-0` sampai `team-8` | Potret anggota sesuai urutan data anggota |
| Tidak ditempatkan | Tidak mengisi slot tertentu; kategori foto tetap dapat muncul di galeri |

Memilih slot yang telah digunakan mengganti gambar pada slot itu. Aset lama tidak terhapus dan dapat dipakai kembali. Galeri publik menampilkan kategori `Sarana`, `Foto Kegiatan`, `Foto Siswa`, `Foto Alumni`, `Foto Makrab`. Aset berkategori `Program`, `Organisasi` dan `Identitas` tidak masuk galeri umum.

Kategori dan judul seed mengikuti referensi tetapi foto stok tidak menggambarkan kejadian atau orang sebenarnya. Ganti foto dan perbarui alt sebelum penggunaan resmi. Sistem ini mengelola gambar saja, bukan video atau PDF.

## Pemulihan

Metadata dan file tersimpan pada server, bukan pada browser. Cadangkan seluruh `DATA_DIR` bersama `public/sites/asahi`. File yang sudah dikeluarkan dari manifest masih dapat diakses lewat URL lama jika URL tersebut diketahui; penghapusan dari daftar bukan pencabutan akses file. Untuk penghapusan fisik/pemenuhan privasi, pengelola server harus menghapus file dan salinan cadangannya sesuai kebutuhan serta mempertimbangkan cache.
