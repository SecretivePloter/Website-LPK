"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import placements from "../../../../data/placements.json";
import type { Map as LeafletMap } from "leaflet";
export function Alumni() {
  const [year, setYear] = useState("Semua Tahun");
  const [info, setInfo] = useState("Klik pada titik untuk melihat detail");
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const filtered = useMemo(
    () =>
      placements.filter(
        (p) => year === "Semua Tahun" || String(p.year) === year,
      ),
    [year],
  );
  const total = filtered.reduce((sum, p) => sum + p.accepted, 0);
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !container.current) return;
      const map = L.map(container.current, {
        zoomControl: false,
        scrollWheelZoom: false,
      }).setView([36.5, 137], 5);
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);
      filtered.forEach((p) => {
        const marker = L.circleMarker([Number(p.lat), Number(p.lng)], {
          radius: Math.max(7, Math.sqrt(p.accepted) * 3),
          color: p.accepted > 10 ? "#a33c32" : "#a4a660",
          fillColor: p.accepted > 10 ? "#ce4e3e" : "#bdc373",
          fillOpacity: 0.8,
          weight: 2,
        }).addTo(map);
        marker.bindTooltip(`${p.city}: ${p.accepted} alumni`);
        marker.on("click", () =>
          setInfo(
            `${p.city}, ${p.prefecture} • ${p.accepted} alumni • ${p.year || "Tahun belum tersedia"}`,
          ),
        );
      });
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [filtered]);
  return (
    <section className="alumni section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">◎ Sebaran Alumni ◎</span>
          <h2>Jejak Keberhasilan Alumni di Jepang</h2>
          <p>
            Telah <strong>{total}</strong> alumni tersebar di berbagai kota di
            Jepang
          </p>
        </div>
        <div className="statistics">
          {[
            [filtered.length, "Kota di Jepang", "▦"],
            [total, "Total Alumni", "♟"],
            [new Set(filtered.map((p) => p.prefecture)).size, "Prefektur", "◇"],
            [
              filtered.length ? Math.round(total / filtered.length) : 0,
              "Rata-rata per Kota",
              "↗",
            ],
          ].map(([n, label, icon]) => (
            <div key={label}>
              <b className="stat-icon">{icon}</b>
              <div>
                <strong>{n}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="map-layout">
          <div className="map-card">
            <div className="map-header">
              <h3>◇ Peta Sebaran Alumni</h3>
              <div>
                <button
                  aria-label="Reset Peta"
                  onClick={() => mapRef.current?.setView([36.5, 137], 5)}
                >
                  ⌖
                </button>
                <button
                  aria-label="Zoom In"
                  onClick={() => mapRef.current?.zoomIn()}
                >
                  +
                </button>
                <button
                  aria-label="Zoom Out"
                  onClick={() => mapRef.current?.zoomOut()}
                >
                  −
                </button>
              </div>
            </div>
            <div
              ref={container}
              className="japan-map"
              aria-label="Peta sebaran alumni di Jepang"
            />
            <p className="map-info" aria-live="polite">
              ⓘ {info}
            </p>
          </div>
          <aside className="map-sidebar">
            <article>
              <h3>🏆 Kota dengan Alumni Terbanyak</h3>
              {[...filtered]
                .sort((a, b) => b.accepted - a.accepted)
                .slice(0, 5)
                .map((p) => (
                  <button
                    key={p.city}
                    onClick={() => {
                      mapRef.current?.setView([+p.lat, +p.lng], 8);
                      setInfo(`${p.city}: ${p.accepted} alumni`);
                    }}
                  >
                    {p.city}
                    <b>{p.accepted}</b>
                  </button>
                ))}
            </article>
            <article>
              <h3>◷ Penempatan Terbaru</h3>
              <p>
                {filtered
                  .filter((p) => p.year)
                  .sort((a, b) => (b.year || 0) - (a.year || 0))
                  .slice(0, 2)
                  .map((p) => `${p.city} (${p.year})`)
                  .join(" • ") || "Belum ada data"}
              </p>
            </article>
            <article>
              <h3>◔ Statistik Cepat</h3>
              <p>
                Kota Terpadat:{" "}
                <b>
                  {[...filtered].sort((a, b) => b.accepted - a.accepted)[0]
                    ?.city || "-"}
                </b>
              </p>
              <p>
                Tahun data: <b>{year === "Semua Tahun" ? "2022–2025" : year}</b>
              </p>
            </article>
          </aside>
        </div>
        <div className="year-filter">
          <h3>▼ Filter Berdasarkan Tahun</h3>
          <div className="chips">
            {["Semua Tahun", "2025", "2024", "2023", "2022"].map((y) => (
              <button
                key={y}
                className={y === year ? "active" : ""}
                onClick={() => {
                  setYear(y);
                  setInfo("Klik pada titik untuk melihat detail");
                }}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
