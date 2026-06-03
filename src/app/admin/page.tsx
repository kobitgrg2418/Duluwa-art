import Link from "next/link";
import { getArtworks, getCollections, getProcess, getTestimonials } from "@/lib/store";
import { getAllUsers } from "@/lib/users";
import { getAllOrders } from "@/lib/orders";

export default async function AdminDashboard() {
  const [artworks, collections, process, testimonials, users, orders] = await Promise.all([
    getArtworks(),
    getCollections(),
    getProcess(),
    getTestimonials(),
    getAllUsers(),
    getAllOrders(),
  ]);

  const totalItems = artworks.length + collections.length + process.length + testimonials.length;
  const featured = artworks.filter((a) => a.feat).length;
  const notFeatured = artworks.length - featured;
  const featPct = artworks.length ? Math.round((featured / artworks.length) * 100) : 0;
  const notFeatPct = 100 - featPct;
  const totalValue = artworks.reduce((s, a) => s + (a.price || 0), 0);
  const avgPrice = artworks.length ? Math.round(totalValue / artworks.length) : 0;

  const collCounts = collections.map((c) => ({
    ...c,
    artworkCount: artworks.filter((a) => a.coll === c.id).length,
  })).sort((a, b) => b.artworkCount - a.artworkCount);

  return (
    <div>
      <div className="adm__page-head">
        <h1 className="adm__title">Dashboard</h1>
        <div className="adm__head-actions">
          <Link href="/admin/artworks" className="adm__btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Import
          </Link>
          <Link href="/admin/artworks" className="adm__btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Export
          </Link>
        </div>
      </div>

      <div className="adm__dash">
        <div className="adm__dash-main">
          <div className="adm__cards">
            {[
              { label: "Artworks", count: artworks.length, href: "/admin/artworks", color: "#4ade80" },
              { label: "Collections", count: collections.length, href: "/admin/collections", color: "#60a5fa" },
              { label: "Process", count: process.length, href: "/admin/process", color: "#c084fc" },
              { label: "Testimonials", count: testimonials.length, href: "/admin/testimonials", color: "#fb923c" },
              { label: "Users", count: users.length, href: "/admin/users", color: "#f472b6" },
              { label: "Orders", count: orders.length, href: "/admin/orders", color: "#22d3ee" },
            ].map((c) => (
              <Link key={c.label} href={c.href} className="adm__card">
                <span className="adm__card-count">{c.count}</span>
                <span className="adm__card-label">{c.label}</span>
                <span className="adm__card-action">Manage &rarr;</span>
              </Link>
            ))}
          </div>

          <div className="adm__section-head">
            <h2 className="adm__section-title">Recent Artworks</h2>
            <Link href="/admin/artworks" className="adm__section-link">View all &rarr;</Link>
          </div>
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
                {artworks.slice(0, 6).map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="adm__cell-art">
                        <span className="adm__initials" style={{ background: `hsl(${a.hue}, 40%, 35%)` }}>
                          {a.title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                        </span>
                        <strong>{a.title}</strong>
                      </div>
                    </td>
                    <td>{collections.find((c) => c.id === a.coll)?.title || a.coll}</td>
                    <td>{a.year}</td>
                    <td className="adm__cell-mono">Rs {a.price?.toLocaleString()}</td>
                    <td>
                      <span className={`adm__status ${a.feat ? "adm__status--yes" : "adm__status--no"}`}>
                        <span className="adm__status-dot" />
                        {a.feat ? "Featured" : "Standard"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="adm__dash-side">
          {/* Gauge panel */}
          <div className="adm__panel">
            <div className="adm__panel-title">Gallery Portfolio</div>
            <div className="adm__gauge">
              <svg viewBox="0 0 120 80" className="adm__gauge-svg">
                <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="#e8e8ec" strokeWidth="10" strokeLinecap="round"/>
                <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="157" strokeDashoffset={157 * (1 - Math.min(totalValue / 20000, 1))}/>
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ade80"/>
                    <stop offset="100%" stopColor="#22d3ee"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="adm__gauge-text">
                <span className="adm__gauge-val">Rs {(totalValue / 1000).toFixed(1)}k</span>
                <span className="adm__gauge-sub">{totalItems} items</span>
              </div>
            </div>
            <div className="adm__panel-row">
              <div>
                <span className="adm__panel-metric">Rs {avgPrice.toLocaleString()}</span>
                <span className="adm__panel-label">Avg. price</span>
              </div>
              <div>
                <span className="adm__panel-metric">Rs {totalValue.toLocaleString()}</span>
                <span className="adm__panel-label">Total value</span>
              </div>
            </div>
          </div>

          {/* Status panel */}
          <div className="adm__panel">
            <div className="adm__panel-head-row">
              <span className="adm__panel-title" style={{ margin: 0 }}>Artwork Status</span>
              <span className="adm__panel-tag">Active</span>
            </div>
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
                  Standard
                </span>
                <span className="adm__stat-val">{notFeatPct}%</span>
              </div>
            </div>
          </div>

          {/* Overview panel */}
          <div className="adm__panel">
            <div className="adm__panel-head-row">
              <span className="adm__panel-title" style={{ margin: 0 }}>Overview</span>
            </div>
            <div className="adm__overview-grid">
              <div className="adm__overview-item">
                <span className="adm__overview-val">{artworks.length}</span>
                <span className="adm__overview-label">Artworks</span>
              </div>
              <div className="adm__overview-item">
                <span className="adm__overview-val">{collections.length}</span>
                <span className="adm__overview-label">Collections</span>
              </div>
              <div className="adm__overview-item">
                <span className="adm__overview-val">{featured}</span>
                <span className="adm__overview-label">Featured</span>
              </div>
              <div className="adm__overview-item">
                <span className="adm__overview-val">{(artworks.length / (collections.length || 1)).toFixed(1)}</span>
                <span className="adm__overview-label">Avg/collection</span>
              </div>
            </div>
          </div>

          {/* Top collections */}
          <div className="adm__panel">
            <div className="adm__panel-title">Top Collections</div>
            <div className="adm__stats">
              {collCounts.slice(0, 5).map((c) => (
                <div key={c.id} className="adm__stat-row">
                  <span className="adm__stat-label">
                    <span className="adm__stat-dot" style={{ background: `hsl(${c.hue}, 50%, 55%)` }} />
                    {c.title}
                  </span>
                  <span className="adm__stat-val">{c.artworkCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
