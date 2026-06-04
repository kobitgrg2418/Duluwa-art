"use client";

import { useState, useActionState } from "react";
import { upsertCollection, deleteCollection } from "@/app/actions/admin";
import { ImageUploader } from "@/components/image-uploader";
import type { Collection } from "@/lib/data";
import type { AdminState } from "@/app/actions/admin";

export function CollectionsManager({ collections }: { collections: Collection[] }) {
  const [editing, setEditing] = useState<Collection | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(upsertCollection, undefined as AdminState);

  function openNew() { setEditing(null); setShowForm(true); }
  function openEdit(c: Collection) { setEditing(c); setShowForm(true); }
  function close() { setShowForm(false); setEditing(null); }

  async function handleDelete(id: string) {
    if (!confirm("Delete this collection?")) return;
    await deleteCollection(id);
    window.location.reload();
  }

  if (state?.ok && showForm) { close(); window.location.reload(); }

  return (
    <>
      <button className="adm__btn adm__btn--primary" onClick={openNew}>+ Add Collection</button>
      {showForm && (
        <div className="adm__modal-overlay" onClick={close}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>{editing ? "Edit Collection" : "New Collection"}</h2>
              <button onClick={close} className="adm__modal-close">&times;</button>
            </div>
            {state?.error && <div className="adm__error">{state.error}</div>}
            <form action={formAction} className="adm__form">
              {editing && <input type="hidden" name="editId" value={editing.id} />}
              <div className="adm__form-grid">
                <div className="adm__field">
                  <label>ID (slug) *</label>
                  <input name="id" defaultValue={editing?.id} required placeholder="e.g. culture" />
                </div>
                <div className="adm__field">
                  <label>Number *</label>
                  <input name="no" defaultValue={editing?.no} required placeholder="e.g. 01" />
                </div>
                <div className="adm__field">
                  <label>Title *</label>
                  <input name="title" defaultValue={editing?.title} required />
                </div>
                <div className="adm__field">
                  <label>Count</label>
                  <input name="count" type="number" defaultValue={editing?.count || 0} />
                </div>
                <div className="adm__field">
                  <label>Hue</label>
                  <input name="hue" type="number" defaultValue={editing?.hue || 0} />
                </div>
                <div className="adm__field adm__field--full">
                  <label>Blurb</label>
                  <textarea name="blurb" rows={2} defaultValue={editing?.blurb} />
                </div>
                <ImageUploader name="cover" label="Cover Image" defaultValue={editing?.cover} accept="image/*" placeholder="JPEG, PNG, WebP" />
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
            <tr><th>No</th><th>ID</th><th>Title</th><th>Cover</th><th>Count</th><th>Hue</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.id}>
                <td>{c.no}</td>
                <td><code>{c.id}</code></td>
                <td><strong>{c.title}</strong></td>
                <td>{c.cover ? <img src={c.cover} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }} /> : "—"}</td>
                <td>{c.count}</td>
                <td><span className="adm__hue-dot" style={{ background: `hsl(${c.hue}, 60%, 50%)` }} /> {c.hue}</td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => openEdit(c)} className="adm__btn adm__btn--sm">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No collections yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
