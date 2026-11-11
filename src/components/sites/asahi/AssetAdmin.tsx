/* eslint-disable @next/next/no-img-element -- Administrator-managed media. */
"use client";
import { useState } from "react";
import Link from "next/link";
import type { Asset } from "@/types/assets";
import { Modal } from "./Modal";
import "./admin.css";
const slots = [
  "logo",
  "hero-background",
  "hero-art",
  "profile",
  "profile-small",
  "footer",
  ...Array.from({ length: 8 }, (_, i) => `facility-${i}`),
  ...Array.from({ length: 9 }, (_, i) => `team-${i}`),
];
export function AssetAdmin({
  authenticated,
  initialAssets,
}: {
  authenticated: boolean;
  initialAssets: Asset[];
}) {
  const [loggedIn, setLoggedIn] = useState(authenticated);
  const [assets, setAssets] = useState(initialAssets);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [editing, setEditing] = useState<Asset | null>(null);
  const [deleting, setDeleting] = useState<Asset | null>(null);
  async function refresh() {
    const r = await fetch("/api/assets", { cache: "no-store" });
    setAssets(await r.json());
  }
  async function request(url: string, options: RequestInit) {
    const r = await fetch(url, options);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "Permintaan gagal.");
    return data;
  }
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      await request("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: form.get("password") }),
      });
      await refresh();
      setLoggedIn(true);
      setMessage("");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setMessage("Mengunggah gambar…");
    try {
      await request("/api/assets", {
        method: "POST",
        body: new FormData(form),
      });
      await refresh();
      form.reset();
      setMessage(
        "Gambar berhasil diunggah. Pilih Edit untuk menempatkannya di halaman.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      await request(`/api/assets/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      await refresh();
      setEditing(null);
      setMessage("Perubahan tersimpan dan digunakan pada website.");
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    try {
      await request(`/api/assets/${deleting.id}`, { method: "DELETE" });
      await refresh();
      setDeleting(null);
      setMessage(
        "Aset dihapus dari daftar. File asli tetap tersedia dalam cadangan server.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!loggedIn)
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <Link href="/">← Kembali ke website</Link>
          <span className="admin-tag">ASAHI · ADMIN</span>
          <h1>Manajemen Aset</h1>
          <p>Masuk untuk mengelola gambar dan penempatannya.</p>
          <label>
            Kata sandi
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="button" disabled={busy}>
            {busy ? "Memeriksa…" : "Masuk →"}
          </button>
          <p role="status">{message}</p>
        </form>
      </main>
    );
  const visible = assets
    .filter(
      (a) =>
        (category === "Semua" || a.category === category) &&
        `${a.title} ${a.alt} ${a.slot}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) => a.order - b.order);
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="admin-brand">
          as<span>a</span>hi<span className="red-dot">●</span>
        </span>
        <small>CONTENT MANAGEMENT</small>
        <h2>Pustaka Media</h2>
        <p>Kelola gambar website dalam satu tempat.</p>
        <a href="/" target="_blank" rel="noreferrer">
          Lihat website ↗
        </a>
        <button
          onClick={async () => {
            try {
              await request("/api/auth", { method: "DELETE" });
              setLoggedIn(false);
              setAssets([]);
            } catch (e) {
              setMessage((e as Error).message);
            }
          }}
        >
          Keluar akun ↗
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-heading">
          <div>
            <span className="admin-tag">WEBSITE / ASET</span>
            <h1>Pustaka Media</h1>
            <p>
              {assets.length} aset · {assets.filter((a) => a.slot).length}{" "}
              ditempatkan di halaman
            </p>
          </div>
          <a className="button" href="#upload">
            + Unggah Gambar
          </a>
        </header>
        <div className="admin-notice" role="status">
          {message ||
            "Foto stok merupakan ilustrasi sementara. Ganti dengan dokumentasi milik lembaga."}
        </div>
        <section className="upload-panel" id="upload">
          <h2>Unggah gambar baru</h2>
          <form onSubmit={upload}>
            <label>
              Gambar JPG, PNG, WebP (maks. 4 MB)
              <input
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
              />
            </label>
            <label>
              Judul
              <input name="title" required maxLength={150} />
            </label>
            <label>
              Teks alternatif
              <input name="alt" required maxLength={300} />
            </label>
            <label>
              Kategori
              <select name="category">
                {[
                  "Sarana",
                  "Foto Kegiatan",
                  "Foto Siswa",
                  "Foto Alumni",
                  "Foto Makrab",
                  "Program",
                  "Organisasi",
                  "Identitas",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <button disabled={busy} className="button" type="submit">
              {busy ? "Memproses…" : "Simpan Gambar ↑"}
            </button>
          </form>
        </section>
        <div className="admin-toolbar">
          <label>
            Cari aset
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, alt, penempatan…"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Semua</option>
              {[...new Set(assets.map((a) => a.category))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <span>{visible.length} hasil</span>
        </div>
        <div className="asset-grid">
          {visible.map((a) => (
            <article className="asset-card" key={a.id}>
              <img src={a.src} alt={a.alt} loading="lazy" />
              <div>
                <small>{a.category}</small>
                <h3>{a.title}</h3>
                <p className="slot-label">{a.slot || "Belum ditempatkan"}</p>
                <div className="asset-actions">
                  <button onClick={() => setEditing({ ...a })}>
                    Edit / Tempatkan
                  </button>
                  <button
                    disabled={!!a.slot}
                    title={
                      a.slot
                        ? "Lepaskan penempatan terlebih dahulu"
                        : "Hapus aset"
                    }
                    onClick={() => setDeleting(a)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!visible.length && (
          <p className="empty">Tidak ada aset yang sesuai.</p>
        )}
      </main>
      {editing && (
        <Modal title="Edit Aset" close={() => setEditing(null)}>
          <form className="asset-edit" onSubmit={save}>
            <img src={editing.src} alt={editing.alt} />
            <label>
              Judul
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                required
              />
            </label>
            <label>
              Teks alternatif
              <input
                value={editing.alt}
                onChange={(e) =>
                  setEditing({ ...editing, alt: e.target.value })
                }
                required
              />
            </label>
            <label>
              Kategori
              <input
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                required
              />
            </label>
            <label>
              Penempatan
              <select
                value={editing.slot}
                onChange={(e) =>
                  setEditing({ ...editing, slot: e.target.value })
                }
              >
                <option value="">Tidak ditempatkan</option>
                {[
                  ...new Set([
                    ...slots,
                    ...assets.map((a) => a.slot).filter(Boolean),
                  ]),
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <p className="admin-hint">
              Memilih penempatan yang sudah dipakai akan mengganti gambar
              sebelumnya. Foto dengan kategori Sarana/Foto juga tampil pada
              galeri.
            </p>
            <label>
              Urutan
              <input
                type="number"
                value={editing.order}
                onChange={(e) =>
                  setEditing({ ...editing, order: Number(e.target.value) })
                }
                required
              />
            </label>
            <p role="status">{message}</p>
            <button disabled={busy} className="button">
              Simpan Perubahan
            </button>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal title="Hapus aset dari daftar?" close={() => setDeleting(null)}>
          <p>{deleting.title} akan dihapus dari daftar media dan galeri.</p>
          <button disabled={busy} className="button" onClick={remove}>
            Hapus Aset
          </button>
          <button onClick={() => setDeleting(null)}>Batal</button>
          <p role="status">{message}</p>
        </Modal>
      )}
    </div>
  );
}
