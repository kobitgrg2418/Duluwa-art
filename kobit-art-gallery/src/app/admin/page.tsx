import Link from "next/link";
import { getArtworks, getCollections, getProcess, getTestimonials } from "@/lib/store";
import { getAllUsers } from "@/lib/users";

export default async function AdminDashboard() {
  const [artworks, collections, process, testimonials, users] = await Promise.all([
    getArtworks(),
    getCollections(),
    getProcess(),
    getTestimonials(),
    getAllUsers(),
  ]);

  const totalItems = artworks.length + collections.length + process.length + testimonials.length;
  const featured = artworks.filter((a) => a.feat).length;
  const notFeatured = artworks.length - featured;
  const featPct = artworks.length ? Math.round((featured / artworks.length) * 100) : 0;
  const notFeatPct = 100 - featPct;

  const cards = [
    { label: "Artworks", count: artworks.length, href: "/admin/artworks", color: "#4ade80" },
    { label: "Collections", count: collections.length, href: "/admin/collections", color: "#60a5fa" },
    { label: "Process Steps", count: process.length, href: "/admin/process", color: "#c084fc" },
    { label: "Testimonials", count: testimonials.length, href: "/admin/testimonials", color: "#fb923c" },
    { label: "Users", count: users.length, href: "/admin/users", color: "#f472b6" },
  ];

  const avgPrice = artworks.length
    ? Math.round(artworks.reduce((s, a) => s + (a.price || 0), 0) / artworks.length)
    : 0;
  const totalValue = artworks.reduce((s, a) => s + (a.price || 0), 0);

  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Dashboard</h1>
        <p className="adm__subtitle">Manage your gallery content</p>
      </div>

      <div className="adm__dash">
        <div className="adm__dash-main">
          <div className="adm__cards">
            {cards.map((c) => (
              <Link key={c.label} href={c.href} className="adm__card">
                <span className="adm__card-count" style={{ color: c.color }}>{c.count}</span>
                <span className="adm__card-label">{c.label}</span>
                <span className="adm__card-action">Manage &rarr;</span>
              </Link>
            ))}
          </div>

          <div>
            <h2 className="adm__title" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Recent Artworks</h2>
            <div className="adm__table-wrap">
              <table className="adm__table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Collection</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.slice(0, 5).map((a) => (
                    <tr key={a.id}>
                      <td><strong>{a.title}</strong></td>
                      <td>{a.coll}</td>
                      <td>{a.year}</td>
                      <td>${a.price}</td>
                      <td>
                        <span className={`adm__status ${a.feat ? "adm__status--yes" : "adm__status--no"}`}>
                          <span className="adm__status-dot" />
                          {a.feat ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="adm__dash-side">
          <div className="adm__panel">
            <div className="adm__panel-title">Gallery Overview</div>
            <div className="adm__panel-big">{totalItems}</div>
            <div className="adm__panel-sub">total items</div>

            <div className="adm__panel-divider" />

            <div className="adm__progress">
              <div className="adm__progress-bar" style={{ width: `${featPct}%`, background: "#4ade80" }} />
              <div className="adm__progress-bar" style={{ width: `${notFeatPct}%`, background: "#ef4444" }} />
            </div>
            <div className="adm__stats">
              <div className="adm__stat-row">
                <span className="adm__stat-label">
                  <span className="adm__stat-dot" style={{ background: "#4ade80" }} />
                  Featured
                </span>
                <span className="adm__stat-val">{featPct}%</span>
              </div>
              <div className="adm__stat-row">
                <span className="adm__stat-label">
                  <span className="adm__stat-dot" style={{ background: "#ef4444" }} />
                  Not Featured
                </span>
                <span className="adm__stat-val">{notFeatPct}%</span>
              </div>
            </div>
          </div>

          <div className="adm__panel">
            <div className="adm__panel-title" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Overview</span>
            </div>
            <div className="adm__overview-grid">
              <div className="adm__overview-item">
                <span className="adm__overview-val">${avgPrice.toLocaleString()}</span>
                <span className="adm__overview-label">Avg. price</span>
              </div>
              <div className="adm__overview-item">
                <span className="adm__overview-val">${totalValue.toLocaleString()}</span>
                <span className="adm__overview-label">Total value</span>
              </div>
              <div className="adm__overview-item">
                <span className="adm__overview-val">{collections.length}</span>
                <span className="adm__overview-label">Collections</span>
              </div>
              <div className="adm__overview-item">
                <span className="adm__overview-val">{(artworks.length / (collections.length || 1)).toFixed(1)}</span>
                <span className="adm__overview-label">Avg. per collection</span>
              </div>
            </div>
          </div>

          <div className="adm__panel">
            <div className="adm__panel-title">Top Collections</div>
            <div className="adm__stats">
              {collections.slice(0, 4).map((c) => (
                <div key={c.id} className="adm__stat-row">
                  <span className="adm__stat-label">
                    <span className="adm__stat-dot" style={{ background: `hsl(${c.hue}, 50%, 55%)` }} />
                    {c.title}
                  </span>
                  <span className="adm__stat-val">{artworks.filter((a) => a.coll === c.id).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
