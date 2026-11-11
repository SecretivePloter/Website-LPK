/* eslint-disable @next/next/no-img-element -- Assets are administrator-managed and served by the media API. */
"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Asset } from "@/types/assets";
import programs from "../../../../data/programs.json";
import { Modal } from "./Modal";
import { Alumni } from "./Alumni";
const nav = [
  ["Home", "/"],
  ["Tentang Kami", "/public/about"],
  ["Program", "/public/program"],
  ["Galeri", "/public/galeri"],
  ["Struktur Organisasi", "/public/organization"],
];
const profile =
  "LPK Asahi Nusantara adalah lembaga pendidikan nonformal yang menyelenggarakan pelatihan kerja bagi masyarakat khususnya dalam bidang bahasa dan budaya Jepang, LPK Asahi Nusantara memiliki peran penting dalam meningkatkan keterampilan tenaga kerja dan Sumber Daya Manusia (SDM) di Indonesia.";
const reasons = [
  [
    "Sistem Pelatihan",
    "Dengan sistem ini, peserta dipersiapkan secara menyeluruh baik secara bahasa, mental, maupun profesional sebelum menjalani program magang di Jepang.",
  ],
  [
    "Pengajar yang Bersertifikasi",
    "Seluruh pengajar kami di LPK Asahi Nusantara juga memiliki sertifikasi bahasa Jepang dan sertifikasi pengajaran yang diakui, sehingga mampu mempersiapkan para peserta dengan baik dan menjamin kualitas pelatihan yang bermutu.",
  ],
  [
    "Perwakilan di Jepang",
    "Kehadiran perwakilan ini memastikan semua pihak baik peserta maupun mitra di Jepang untuk merasa aman dan mendapatkan dukungan yang berkelanjutan.",
  ],
  [
    "Mitra LPK Asahi Nusantara",
    "Mitra yang bekerjasama dengan LPK Asahi Nusantara sangat beragam mulai dari usaha mikro, kecil, dan menengah, hingga perusahaan besar. Dengan keberagaman ini, kami memiliki pengalaman yang luas dalam memahami dan memenuhi kebutuhan setiap mitra di Jepang secara tepat dan sesuai karakteristik masing-masing.",
  ],
  [
    "Biaya Pelatihan",
    "Biaya pelatihan di LPK Asahi Nusantara dirancang agar tetap terjangkau bagi peserta magang. Hal ini menjadi salah satu daya tarik utama bagi para generasi muda yang ingin meningkatkan keterampilan dan memiliki pengalaman magang di Jepang yang sekaligus memudahkan LPK Asahi Nusantara dalam menjaring calon peserta yang potensial.",
  ],
];
const members = [
  ["Aam Ahmad Makki", "Pembina"],
  ["Hj. Apriyatin", "Penasehat"],
  ["Hasan Badrudin", "Direktur"],
  ["Ucu Fathul Hoer", "Humas/Rekrutment"],
  ["Muhammad Rifqy Mufid", "Sekretaris"],
  ["Wina Aprizia", "Bendahara"],
  ["Agustian Fareri", "Sensei 1"],
  ["Anang Lerian", "Sensei 2"],
  ["Iya Triana", "Sensei 3"],
];
const whatsapp = "https://wa.me/6281332077926";
export function Website({ page, assets }: { page: string; assets: Asset[] }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [reason, setReason] = useState(0);
  const [category, setCategory] = useState("Semua");
  const [limit, setLimit] = useState(12);
  const [modal, setModal] = useState<{
    title: string;
    image?: string;
    description?: string;
  } | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const image = (slot: string) =>
    assets.find((a) => a.slot === slot)?.src || "/sites/asahi/stock-1.jpg";
  const picture = (slot: string, alt: string, className = "") => (
    <img
      className={className}
      src={image(slot)}
      alt={assets.find((a) => a.slot === slot)?.alt || alt}
    />
  );
  const gallery = assets
    .filter(
      (a) =>
        [
          "Sarana",
          "Foto Kegiatan",
          "Foto Siswa",
          "Foto Alumni",
          "Foto Makrab",
        ].includes(a.category) &&
        (category === "Semua" || a.category === category),
    )
    .sort((a, b) => a.order - b.order);
  const facilities = assets
    .filter((a) => a.slot.startsWith("facility-"))
    .sort((a, b) => a.order - b.order);
  const openAsset = (a: Asset) => setModal({ title: a.title, image: a.src });
  return (
    <>
      <a href="#main" className="skip-link">
        Lewati ke konten
      </a>
      <header className="site-header">
        <Link href="/" aria-label="Asahi Beranda">
          {picture("logo", "Asahi", "logo")}
        </Link>
        <nav aria-label="Navigasi utama">
          {nav.map(([name, href]) => (
            <Link
              aria-current={pathname === href ? "page" : undefined}
              key={href}
              href={href}
            >
              {name}
            </Link>
          ))}
        </nav>
        <button
          className="menu-toggle"
          aria-label="Buka menu kontak"
          aria-expanded={drawer}
          onClick={() => setDrawer(!drawer)}
        >
          ☰
        </button>
      </header>
      {drawer && (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside
            className="contact-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setDrawer(false)}
              aria-label="Tutup menu"
            >
              ×
            </button>
            {picture("logo", "Asahi", "logo")}
            <h2>Quick Contact</h2>
            <p>Ds. Kasomalang Kulon Kec. Kasomalang, Subang, Indonesia 41281</p>
            <a href="tel:+6281332077926">+62 813 3207 7926</a>
            <a href="mailto:asahinihonggo18@gmail.com">
              asahinihonggo18@gmail.com
            </a>
            <div className="mobile-nav">
              {nav.map(([n, h]) => (
                <Link key={h} href={h} onClick={() => setDrawer(false)}>
                  {n}
                </Link>
              ))}
            </div>
            <a className="button" href={whatsapp}>
              Daftar ↗
            </a>
          </aside>
        </div>
      )}
      <main id="main">
        {page === "home" && (
          <>
            <section
              className="hero"
              style={{ backgroundImage: `url(${image("hero-background")})` }}
            >
              <div className="hero-copy">
                <div className="japanese-title">✦　朝 日 日 本 語 学 校　✦</div>
                <h1>
                  LPK/LKP ASAHI
                  <br />
                  NUSANTARA
                  <br />
                  <span>#yukkerjadijepang</span>
                </h1>
                <p>
                  Diklat bahasa & budaya Jepang untuk persiapan berkarir di🇯🇵
                </p>
                <div className="hero-actions">
                  <Link href="/public/program" className="button">
                    Kepoin Yuk! <i>↗</i>
                  </Link>
                  <a className="phone" href="tel:+6281332077926">
                    <span>♧</span>
                    <div>
                      Butuh bantuan?
                      <br />
                      (+62) 81332077926
                    </div>
                  </a>
                </div>
              </div>
              {picture(
                "hero-art",
                "Ilustrasi berbagai profesi di Jepang",
                "hero-art",
              )}
            </section>
            <section className="section profile-section container">
              <div className="profile-photos">
                {picture("profile", "Kegiatan pembelajaran", "profile-main")}
                {picture("profile-small", "Ruang kelas", "profile-small")}
                <span className="photo-star">✳</span>
              </div>
              <div>
                <span className="eyebrow">◎ Our Company ◎</span>
                <h2>
                  Profil LPK/LKP
                  <br />
                  ASAHI NUSANTARA
                </h2>
                <p>{profile}</p>
                <Link className="button" href="/public/about">
                  Selengkapnya <i>↗</i>
                </Link>
              </div>
            </section>
            <section className="services section">
              <div className="container">
                <div className="section-heading">
                  <span className="eyebrow">◎ Our Services ◎</span>
                  <h2>Kenapa harus memilih kami?</h2>
                </div>
                <div className="services-layout">
                  <div
                    className="service-tabs"
                    role="tablist"
                    aria-label="Keunggulan"
                  >
                    {reasons.map(([title], i) => (
                      <button
                        id={`reason-${i}`}
                        role="tab"
                        aria-controls="reason-panel"
                        aria-selected={reason === i}
                        key={title}
                        onClick={() => setReason(i)}
                      >
                        <span>0{i + 1}</span>
                        {title}
                        <b>↗</b>
                      </button>
                    ))}
                  </div>
                  <article
                    id="reason-panel"
                    role="tabpanel"
                    aria-labelledby={`reason-${reason}`}
                  >
                    <span className="service-symbol">✳</span>
                    <h3>{reasons[reason][0]}</h3>
                    <p>{reasons[reason][1]}</p>
                  </article>
                </div>
              </div>
            </section>
            <section className="section facilities">
              <div className="section-heading">
                <span className="eyebrow">◎ Saran dan Prasarana ◎</span>
                <h2>Fasilitas Lengkap untuk Pembelajaran</h2>
              </div>
              {[facilities, [...facilities].reverse()].map((row, index) => (
                <div className={`marquee row-${index}`} key={index}>
                  <div className="marquee-track">
                    {[...row, ...row].map((a, i) => (
                      <button
                        key={a.id + i}
                        onClick={() => openAsset(a)}
                        className="photo-card"
                      >
                        <img src={a.src} alt={a.alt} />
                        <span>
                          <b>{a.title}</b>
                          <small>Sarana</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="center">
                <Link href="/public/galeri" className="button">
                  ▧ Lihat Semua Galeri ↗
                </Link>
              </div>
            </section>
            <Alumni />
          </>
        )}
        {page === "about" && (
          <>
            <PageBanner title="Tentang Kami" />
            <section className="section about-background">
              <div className="container about-layout">
                <div>
                  {picture("profile", "Pelatihan di LPK Asahi", "about-image")}
                </div>
                <article>
                  <span className="eyebrow">◎ Our Company ◎</span>
                  <h2>Profil</h2>
                  <p>{profile}</p>
                  <p>
                    LPK Asahi Nusantara menawarkan pelatihan berbasis kebutuhan
                    pasar yang beragam, dari mulai pengolahan makanan, kaigo,
                    building cleaning dan pertanian. Selain itu juga kami
                    berperan sebagai jembatan antara tenaga kerja dan perusahaan
                    mitra, baik di dalam maupun luar negeri.
                  </p>
                  <h3>Bidang:</h3>
                  <ol>
                    <li>Program Magang</li>
                    <li>Program Tokutei Ginou/SSW</li>
                    <li>LKP Bahasa Jepang & Inggris</li>
                  </ol>
                </article>
                <div className="value-card">
                  <h2>Visi</h2>
                  <p>
                    Membantu program negara dan meningkatkan kualitas ekonomi
                    dan SDM agar menjadi terampil dan berakhlakul karimah
                    sehingga menghasilkan generasi muda yang siap bersaing di
                    era globalisasi yang penuh dengan tantangan.
                  </p>
                </div>
                <div className="value-card">
                  <h2>Misi</h2>
                  <p>
                    Menyelenggarakan kegiatan Diklat Bahasa dan budaya Jepang
                    yang disiplin yang dipadukan dengan sentuhan nilai
                    Keagamaan. Meningkatkan keterampilan dan membentuk karakter
                    yang BAKU (Baik dan Kuat), pekerja keras dan profesional
                    dalam bekerja.
                  </p>
                </div>
                <div className="motto">
                  <h2>Motto</h2>
                  <p lang="ja">私達の笑顔で世界を変えよう</p>
                </div>
              </div>
            </section>
          </>
        )}
        {page === "program" && (
          <section className="section subpage">
            <div className="section-heading container">
              <span className="eyebrow">◎ Type of Jobs ◎</span>
              <h1>Apa saja sih jenis-jenis pekerjaannya?</h1>
            </div>
            {["Magang", "Tokutei Ginou"].map((group) => (
              <div
                className="container program-group"
                id={group === "Magang" ? "magang" : "tokutei"}
                key={group}
              >
                <h2 className="category-heading">{group.toUpperCase()}</h2>
                <div className="program-grid">
                  {programs
                    .filter((p) => p.category === group)
                    .map((p) => (
                      <button
                        className="photo-card program-card"
                        key={p.id}
                        onClick={() =>
                          setModal({
                            title: p.name,
                            image: image(p.assetId),
                            description: p.description,
                          })
                        }
                      >
                        {picture(p.assetId, p.name)}
                        <span>
                          <b>{p.name}</b>
                          <small>Klik untuk melihat detail Program</small>
                        </span>
                        <i>↗</i>
                      </button>
                    ))}
                </div>
              </div>
            ))}
            <div id="pelatihan" className="container value-card">
              <h2>Pelatihan Bahasa Jepang</h2>
              <p>
                Informasi kelas bahasa dan persiapan program dapat
                dikonsultasikan langsung dengan tim LPK Asahi Nusantara.
              </p>
              <a className="button" href={whatsapp}>
                Konsultasi Program ↗
              </a>
            </div>
          </section>
        )}
        {page === "galeri" && (
          <section className="section subpage container">
            <div className="section-heading">
              <h1>Galeri Foto</h1>
              <p>Lihat momen-momen terbaik dari kegiatan kami</p>
            </div>
            <div className="chips gallery-filters">
              {[
                "Semua",
                ...new Set(
                  assets
                    .filter(
                      (a) =>
                        a.category.startsWith("Foto") ||
                        a.category === "Sarana",
                    )
                    .map((a) => a.category),
                ),
              ].map((c) => (
                <button
                  key={c}
                  className={c === category ? "active" : ""}
                  onClick={() => {
                    setCategory(c);
                    setLimit(12);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="gallery-grid">
              {gallery.slice(0, limit).map((a, i) => (
                <button
                  className="photo-card"
                  key={a.id}
                  onClick={() => setLightboxIndex(i)}
                >
                  <img src={a.src} alt={a.alt} loading="lazy" />
                  <span>
                    <b>{a.title}</b>
                    <small>{a.category}</small>
                  </span>
                </button>
              ))}
            </div>
            {gallery.length === 0 && (
              <p className="empty">Belum ada foto di kategori ini.</p>
            )}
            {limit < gallery.length && (
              <div className="center">
                <button className="button" onClick={() => setLimit(limit + 12)}>
                  Muat Lebih Banyak ↓
                </button>
              </div>
            )}
          </section>
        )}
        {page === "organization" && (
          <section className="section subpage container">
            <div className="section-heading">
              <h1>Struktur Organisasi</h1>
              <p>Tim profesional yang membangun LPK/LKP ASAHI NUSANTARA</p>
            </div>
            {[
              ["Pembina & Penasihat", 0, 2],
              ["Tim Pelaksana", 2, 9],
            ].map(([title, start, end]) => (
              <div className="team-group" key={title}>
                <h2>{title}</h2>
                <div className="team-grid">
                  {members
                    .slice(Number(start), Number(end))
                    .map(([name, role], i) => (
                      <article key={name} className="team-card">
                        {picture(
                          `team-${Number(start) + i}`,
                          "Foto ilustrasi sementara",
                        )}
                        <small>{role}</small>
                        <h3>{name}</h3>
                        <p>LPK Asahi Nusantara</p>
                        <button
                          onClick={() =>
                            setModal({
                              title: name,
                              image: image(`team-${Number(start) + i}`),
                              description: `${role} • LPK Asahi Nusantara. Foto ini merupakan ilustrasi sementara. Biografi dan informasi kontak belum tersedia pada referensi.`,
                            })
                          }
                        >
                          Lihat Detail ↗
                        </button>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </section>
        )}
        {["legalitas", "privacy-policy", "terms-conditions"].includes(page) && (
          <>
            <PageBanner
              title={
                page === "legalitas"
                  ? "Legalitas"
                  : page === "privacy-policy"
                    ? "Kebijakan Privasi"
                    : "Syarat & Ketentuan"
              }
            />
            <section className="section container legal-copy">
              {page === "legalitas" ? (
                <>
                  <h2>Lembaga Terdaftar & Berizin Resmi</h2>
                  <Legal />
                  <p>
                    Salinan dokumen legalitas dapat diminta melalui kontak resmi
                    lembaga.
                  </p>
                </>
              ) : (
                <>
                  <h2>Informasi belum tersedia</h2>
                  <p>
                    Halaman sumber tidak menyediakan isi kebijakan yang dapat
                    diakses. Hubungi pengelola untuk informasi resmi sebelum
                    mengirimkan data atau melakukan pendaftaran.
                  </p>
                </>
              )}
              <a className="button" href={whatsapp}>
                Hubungi Pengelola ↗
              </a>
            </section>
          </>
        )}
      </main>
      <footer
        style={{
          backgroundImage: `linear-gradient(110deg,rgba(40,99,135,.94),rgba(21,60,113,.92)),url(${image("footer")})`,
        }}
      >
        <div className="footer-grid">
          <div>
            {picture("logo", "Asahi", "logo")}
            <p>#yukkerjadijepang</p>
            <div className="legal-box">
              <strong>☀ Lembaga Terdaftar & Berizin Resmi</strong>
              <Legal />
            </div>
            <p>
              ⌖ Ds. Kasomalang Kulon Kec. Kasomalang, Subang, Indonesia 41281
            </p>
            <a href="tel:+6281332077926">☎ 81332077926</a>
            <a href="mailto:asahinihonggo18@gmail.com">
              ✉ asahinihonggo18@gmail.com
            </a>
            <p>◷ Senin - Jumat: 08:00 - 17:00</p>
          </div>
          <div>
            <h3>Tautan Cepat</h3>
            {nav.map(([n, h]) => (
              <Link key={h} href={h}>
                {n === "Home" ? "Beranda" : n}
              </Link>
            ))}
          </div>
          <div>
            <h3>Program Kami</h3>
            <Link href="/public/program#magang">Program Magang Jepang</Link>
            <Link href="/public/program#tokutei">Program Tokutei Ginou</Link>
            <Link href="/public/program#pelatihan">
              Pelatihan Bahasa Jepang
            </Link>
          </div>
          <div>
            <h3>Kontak & Lokasi</h3>
            <div className="help-box">
              <h4>☏ Butuh Bantuan?</h4>
              <p>Tim kami siap membantu Anda</p>
              <a className="whatsapp" href={whatsapp}>
                ◉ Chat WhatsApp
              </a>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=LPK+Asahi+Nusantara+Subang">
              ⌖ Lihat Lokasi di Google Maps
            </a>
            <div className="help-box">
              <p>♧ Perusahaan Terverifikasi</p>
              <Link href="/public/legalitas">Lihat Dokumen Legalitas</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            Copyright © {new Date().getFullYear()} LPK/LKP ASAHI NUSANTARA. All
            rights reserved.
          </span>
          <div>
            <Link href="/public/privacy-policy">Kebijakan Privasi</Link>
            <Link href="/public/terms-conditions">Syarat & Ketentuan</Link>
            <Link href="/public/legalitas">Legalitas</Link>
          </div>
        </div>
      </footer>
      {modal && (
        <Modal title={modal.title} close={() => setModal(null)}>
          {modal.image && (
            <img className="detail-image" src={modal.image} alt={modal.title} />
          )}
          <p className="preserve-lines">{modal.description}</p>
          <button className="button" onClick={() => setModal(null)}>
            Tutup
          </button>
        </Modal>
      )}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <Modal
          title={gallery[lightboxIndex].title}
          close={() => setLightboxIndex(null)}
        >
          <img
            className="detail-image"
            src={gallery[lightboxIndex].src}
            alt={gallery[lightboxIndex].alt}
          />
          <div className="lightbox-controls">
            <button
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + gallery.length) % gallery.length,
                )
              }
              aria-label="Foto sebelumnya"
            >
              ❮
            </button>
            <span>
              {lightboxIndex + 1} / {gallery.length}
            </span>
            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % gallery.length)
              }
              aria-label="Foto berikutnya"
            >
              ❯
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
function PageBanner({ title }: { title: string }) {
  return (
    <section className="page-banner">
      <h1>{title}</h1>
      <p>
        <Link href="/">Home</Link>　›　{title}
      </p>
    </section>
  );
}
function Legal() {
  return (
    <ul className="legal-list">
      <li>KEMENKUMHAM: AHU-0017141.AH.01.04 TAHUN 2018</li>
      <li>NIB: 2006230009372</li>
      <li>VIN: LPK: 2201321301</li>
      <li>IZIN LPK: M.05.02/1554/BIDLATTAS/2023</li>
    </ul>
  );
}
