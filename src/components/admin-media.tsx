"use client";

import { useState, useActionState } from "react";
import { upsertSiteMedia, deleteSiteMedia } from "@/app/actions/admin";
import type { SiteMedia } from "@/lib/data";
import type { AdminState } from "@/app/actions/admin";

const KNOWN_KEYS = [
  { key: "hero_image", label: "Hero Background Image", placeholder: "/assets/hero-bg.png" },
  { key: "video_src", label: "Studio Video Source", placeholder: "/assets/studio-film.mp4" },
  { key: "video_poster", label: "Studio Video Poster Image", placeholder: "/assets/video-poster.jpeg" },
];

export function SiteMediaManager({ media }: { media: SiteMedia[] }) {
  const [editing, setEditing] = useState<SiteMedia | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(upsertSiteMedia, undefined as AdminState);

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(m: SiteMedia) {
    setEditing(m);
    setShowForm(true);
  }
  function close() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(key: string) {
    if (!confirm("Delete this media entry?")) return;
    await deleteSiteMedia(key);
    window.location.reload();
  }

  if (state?.ok && showForm) {
    close();
    window.location.reload();
  }

  const missingKeys = KNOWN_KEYS.filter((k) => !media.find((m) => m.key === k.key));

  return (
    <>
      <div className="adm__toolbar">
        <button className="adm__btn adm__btn--primary" onClick={openNew}>+ Add Media</button>
      </div>

      {missingKeys.length > 0 && (
        <div style={{ padding: "1rem", background: "rgba(251,146,60,0.08)", borderRadius: 8, marginBottom: "1rem", border: "1px solid rgba(251,146,60,0.2)" }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#b45309" }}>
            Missing entries: {missingKeys.map((k) => k.label).join(", ")}. Click &quot;+ Add Media&quot; to configure them.
          </p>
        </div>
      )}

      {showForm && (
        <div className="adm__modal-overlay" onClick={close}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>{editing ? "Edit Media" : "New Media"}</h2>
              <button onClick={close} className="adm__modal-close">&times;</button>
            </div>
            {state?.error && <div className="adm__error">{state.error}</div>}
            <form action={formAction} className="adm__form">
              <div className="adm__form-grid">
                <div className="adm__field adm__field--full">
                  <label>Key *</label>
                  {editing ? (
                    <>
                      <input name="key" value={editing.key} readOnly style={{ opacity: 0.6 }} />
                    </>
                  ) : (
                    <select name="key" defaultValue="" required>
                      <option value="">Select a key...</option>
                      {KNOWN_KEYS.map((k) => (
                        <option key={k.key} value={k.key}>{k.label} ({k.key})</option>
                      ))}
                      <option value="__custom">Custom key...</option>
                    </select>
                  )}
                </div>
                <div className="adm__field adm__field--full">
                  <label>Label</label>
                  <input name="label" defaultValue={editing?.label} placeholder="Human-readable description" />
                </div>
                <div className="adm__field adm__field--full">
                  <label>Value (path) *</label>
                  <input name="value" defaultValue={editing?.value} placeholder="/assets/filename.jpeg" required />
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
              <th>Key</th>
              <th>Label</th>
              <th>Value</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {media.map((m) => (
              <tr key={m.key}>
                <td><code style={{ fontSize: "0.8rem" }}>{m.key}</code></td>
                <td>{m.label || "—"}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.value || "—"}</td>
                <td>
                  {m.value && (m.value.match(/\.(jpe?g|png|webp|gif)$/i)) ? (
                    <img src={m.value} alt={m.label} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4 }} />
                  ) : m.value && m.value.match(/\.(mp4|mov|webm)$/i) ? (
                    <span style={{ fontSize: "0.8rem", color: "#6366f1" }}>Video</span>
                  ) : (
                    <span className="adm__no-img">—</span>
                  )}
                </td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => openEdit(m)} className="adm__btn adm__btn--sm">Edit</button>
                    <button onClick={() => handleDelete(m.key)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {media.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No site media configured yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
