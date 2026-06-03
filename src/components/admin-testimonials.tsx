"use client";

import { useState, useActionState } from "react";
import { upsertTestimonial, deleteTestimonial } from "@/app/actions/admin";
import type { Testimonial } from "@/lib/data";
import type { AdminState } from "@/app/actions/admin";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(upsertTestimonial, undefined as AdminState);

  const editing = editIdx !== null ? testimonials[editIdx] : null;

  function openNew() { setEditIdx(null); setShowForm(true); }
  function openEdit(i: number) { setEditIdx(i); setShowForm(true); }
  function close() { setShowForm(false); setEditIdx(null); }

  async function handleDelete(i: number) {
    if (!confirm("Delete this testimonial?")) return;
    await deleteTestimonial(i);
    window.location.reload();
  }

  if (state?.ok && showForm) { close(); window.location.reload(); }

  return (
    <>
      <button className="adm__btn adm__btn--primary" onClick={openNew}>+ Add Testimonial</button>
      {showForm && (
        <div className="adm__modal-overlay" onClick={close}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
              <button onClick={close} className="adm__modal-close">&times;</button>
            </div>
            {state?.error && <div className="adm__error">{state.error}</div>}
            <form action={formAction} className="adm__form">
              {editIdx !== null && <input type="hidden" name="editIdx" value={editIdx} />}
              <div className="adm__form-grid">
                <div className="adm__field adm__field--full">
                  <label>Quote *</label>
                  <textarea name="quote" rows={3} defaultValue={editing?.quote} required />
                </div>
                <div className="adm__field">
                  <label>Name *</label>
                  <input name="who" defaultValue={editing?.who} required />
                </div>
                <div className="adm__field">
                  <label>Role</label>
                  <input name="role" defaultValue={editing?.role} placeholder="e.g. Curator, Gallery Name" />
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
            <tr><th>Quote</th><th>Name</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {testimonials.map((t, i) => (
              <tr key={i}>
                <td style={{ maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.quote}</td>
                <td><strong>{t.who}</strong></td>
                <td>{t.role}</td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => openEdit(i)} className="adm__btn adm__btn--sm">Edit</button>
                    <button onClick={() => handleDelete(i)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No testimonials yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
