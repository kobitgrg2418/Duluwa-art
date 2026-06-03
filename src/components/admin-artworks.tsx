"use client";

import { useState, useActionState } from "react";
import { upsertArtwork, deleteArtwork, batchSetArtworkStatus } from "@/app/actions/admin";
import type { Artwork, Collection } from "@/lib/data";
import type { AdminState } from "@/app/actions/admin";

export function ArtworksManager({ artworks, collections }: { artworks: Artwork[]; collections: Collection[] }) {
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(upsertArtwork, undefined as AdminState);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchPending, setBatchPending] = useState(false);

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

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === artworks.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(artworks.map((a) => a.id)));
    }
  }

  async function handleBatch(status: "IN_SALE" | "SOLD_OUT") {
    if (selected.size === 0) return;
    const label = status === "SOLD_OUT" ? "Sold Out" : "In Sale";
    if (!confirm(`Mark ${selected.size} artwork(s) as ${label}?`)) return;
    setBatchPending(true);
    await batchSetArtworkStatus(Array.from(selected), status);
    setBatchPending(false);
    setSelected(new Set());
    window.location.reload();
  }

  if (state?.ok && showForm) {
    close();
    window.location.reload();
  }

  return (
    <>
      <div className="adm__toolbar">
        <button className="adm__btn adm__btn--primary" onClick={openNew}>+ Add Artwork</button>

        {selected.size > 0 && (
          <div className="adm__batch-bar">
            <span className="adm__batch-count">{selected.size} selected</span>
            <button
              className="adm__btn adm__btn--sm"
              style={{ background: "#4ade80", color: "#fff", border: "none" }}
              disabled={batchPending}
              onClick={() => handleBatch("IN_SALE")}
            >
              Mark In Sale
            </button>
            <button
              className="adm__btn adm__btn--sm"
              style={{ background: "#ef4444", color: "#fff", border: "none" }}
              disabled={batchPending}
              onClick={() => handleBatch("SOLD_OUT")}
            >
              Mark Sold Out
            </button>
            <button
              className="adm__btn adm__btn--sm"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </button>
          </div>
        )}
      </div>

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
                  <label>Status</label>
                  <select name="status" defaultValue={editing?.status || "IN_SALE"}>
                    <option value="IN_SALE">In Sale</option>
                    <option value="SOLD_OUT">Sold Out</option>
                  </select>
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
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selected.size === artworks.length && artworks.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Image</th>
              <th>Title</th>
              <th>Collection</th>
              <th>Year</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((a) => (
              <tr key={a.id} style={selected.has(a.id) ? { background: "rgba(99,102,241,0.06)" } : undefined}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(a.id)}
                    onChange={() => toggleSelect(a.id)}
                  />
                </td>
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
                <td>Rs {a.price}</td>
                <td>
                  <span
                    className="adm__status"
                    style={{
                      color: a.status === "SOLD_OUT" ? "#ef4444" : "#4ade80",
                    }}
                  >
                    <span
                      className="adm__status-dot"
                      style={{ background: a.status === "SOLD_OUT" ? "#ef4444" : "#4ade80" }}
                    />
                    {a.status === "SOLD_OUT" ? "Sold Out" : "In Sale"}
                  </span>
                </td>
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
              <tr><td colSpan={9} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No artworks yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
