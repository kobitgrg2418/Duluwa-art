"use client";

import { useState, useActionState } from "react";
import { upsertArtwork, deleteArtwork } from "@/app/actions/admin";
import type { Artwork, Collection } from "@/lib/data";
import type { AdminState } from "@/app/actions/admin";

export function ArtworksManager({ artworks, collections }: { artworks: Artwork[]; collections: Collection[] }) {
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(upsertArtwork, undefined as AdminState);

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(a: Artwork) {
    setEditing(a);
    setShowForm(true);
  }
  function close() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork?")) return;
    await deleteArtwork(id);
    window.location.reload();
  }

  if (state?.ok && showForm) {
    close();
    window.location.reload();
  }

  return (
    <>
      <button className="adm__btn adm__btn--primary" onClick={openNew}>+ Add Artwork</button>

      {showForm && (
        <div className="adm__modal-overlay" onClick={close}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>{editing ? "Edit Artwork" : "New Artwork"}</h2>
              <button onClick={close} className="adm__modal-close">&times;</button>
            </div>
            {state?.error && <div className="adm__error">{state.error}</div>}
            <form action={formAction} className="adm__form">
              {editing && <input type="hidden" name="id" value={editing.id} />}
              <div className="adm__form-grid">
                <div className="adm__field">
                  <label>Title *</label>
                  <input name="title" defaultValue={editing?.title} required />
                </div>
                <div className="adm__field">
                  <label>Year *</label>
                  <input name="year" defaultValue={editing?.year} required />
                </div>
                <div className="adm__field">
                  <label>Medium *</label>
                  <input name="medium" defaultValue={editing?.medium} required />
                </div>
                <div className="adm__field">
                  <label>Size</label>
                  <input name="size" defaultValue={editing?.size} />
                </div>
                <div className="adm__field">
                  <label>Collection *</label>
                  <select name="coll" defaultValue={editing?.coll || ""} required>
                    <option value="">Select...</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="adm__field">
                  <label>Price</label>
                  <input name="price" type="number" defaultValue={editing?.price || 0} />
                </div>
                <div className="adm__field">
                  <label>Hue</label>
                  <input name="hue" type="number" defaultValue={editing?.hue || 0} />
                </div>
                <div className="adm__field">
                  <label>Ratio</label>
                  <input name="ratio" type="number" step="0.01" defaultValue={editing?.ratio || 1} />
                </div>
                <div className="adm__field adm__field--full">
                  <label>Image Path</label>
                  <input name="image" defaultValue={editing?.image} placeholder="/assets/filename.jpeg" />
                </div>
                <div className="adm__field adm__field--full">
                  <label>Note</label>
                  <textarea name="note" rows={2} defaultValue={editing?.note} />
                </div>
                <div className="adm__field">
                  <label className="adm__checkbox">
                    <input type="checkbox" name="feat" defaultChecked={editing?.feat} />
                    Featured
                  </label>
                </div>
              </div>
              <div className="adm__form-actions">
                <button type="button" onClick={close} className="adm__btn">Cancel</button>
                <button type="submit" className="adm__btn adm__btn--primary" disabled={pending}>
                  {pending ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="adm__table-wrap">
        <table className="adm__table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Collection</th>
              <th>Year</th>
              <th>Medium</th>
              <th>Price</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.image ? (
                    <img src={a.image} alt={a.title} style={{ width: 48, height: 48, objectFit: "cover" }} />
                  ) : (
                    <span className="adm__no-img">—</span>
                  )}
                </td>
                <td><strong>{a.title}</strong></td>
                <td>{collections.find((c) => c.id === a.coll)?.title || a.coll}</td>
                <td>{a.year}</td>
                <td>{a.medium}</td>
                <td>Rs {a.price}</td>
                <td>{a.feat ? "Yes" : "No"}</td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => openEdit(a)} className="adm__btn adm__btn--sm">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No artworks yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
