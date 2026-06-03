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

  const cards = [
    { label: "Artworks", count: artworks.length, href: "/admin/artworks", color: "var(--gold)" },
    { label: "Collections", count: collections.length, href: "/admin/collections", color: "#4a8" },
    { label: "Process Steps", count: process.length, href: "/admin/process", color: "#68c" },
    { label: "Testimonials", count: testimonials.length, href: "/admin/testimonials", color: "#c68" },
    { label: "Users", count: users.length, href: "/admin/users", color: "#86c" },
  ];

  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Dashboard</h1>
        <p className="adm__subtitle">Manage your gallery content</p>
      </div>
      <div className="adm__cards">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="adm__card">
            <span className="adm__card-count" style={{ color: c.color }}>{c.count}</span>
            <span className="adm__card-label">{c.label}</span>
            <span className="adm__card-action">Manage &rarr;</span>
          </Link>
        ))}
      </div>
      <div className="adm__header" style={{ marginTop: "3rem" }}>
        <h2 className="adm__title" style={{ fontSize: "1.4rem" }}>Recent Artworks</h2>
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
            {artworks.slice(0, 5).map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.coll}</td>
                <td>{a.year}</td>
                <td>${a.price}</td>
                <td>{a.feat ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
