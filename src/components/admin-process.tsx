"use client";

import { useState, useActionState } from "react";
import { upsertProcess, deleteProcess } from "@/app/actions/admin";
import type { ProcessStep } from "@/lib/data";
import type { AdminState } from "@/app/actions/admin";

export function ProcessManager({ steps }: { steps: ProcessStep[] }) {
  const [editing, setEditing] = useState<ProcessStep | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, pending] = useActionState(upsertProcess, undefined as AdminState);

  function openNew() { setEditing(null); setShowForm(true); }
  function openEdit(s: ProcessStep) { setEditing(s); setShowForm(true); }
  function close() { setShowForm(false); setEditing(null); }

  async function handleDelete(no: string) {
    if (!confirm("Delete this step?")) return;
    await deleteProcess(no);
    window.location.reload();
  }

  if (state?.ok && showForm) { close(); window.location.reload(); }

  return (
    <>
      <button className="adm__btn adm__btn--primary" onClick={openNew}>+ Add Step</button>
      {showForm && (
        <div className="adm__modal-overlay" onClick={close}>
          <div className="adm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm__modal-head">
              <h2>{editing ? "Edit Step" : "New Step"}</h2>
              <button onClick={close} className="adm__modal-close">&times;</button>
            </div>
            {state?.error && <div className="adm__error">{state.error}</div>}
            <form action={formAction} className="adm__form">
              {editing && <input type="hidden" name="editNo" value={editing.no} />}
              <div className="adm__form-grid">
                <div className="adm__field">
                  <label>Number *</label>
                  <input name="no" defaultValue={editing?.no} required placeholder="e.g. 01" />
                </div>
                <div className="adm__field">
                  <label>Title *</label>
                  <input name="title" defaultValue={editing?.title} required />
                </div>
                <div className="adm__field">
                  <label>Hue</label>
                  <input name="hue" type="number" defaultValue={editing?.hue || 0} />
                </div>
                <div className="adm__field adm__field--full">
                  <label>Text</label>
                  <textarea name="text" rows={3} defaultValue={editing?.text} />
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
            <tr><th>No</th><th>Title</th><th>Hue</th><th>Text</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {steps.map((s) => (
              <tr key={s.no}>
                <td>{s.no}</td>
                <td><strong>{s.title}</strong></td>
                <td><span className="adm__hue-dot" style={{ background: `hsl(${s.hue}, 60%, 50%)` }} /> {s.hue}</td>
                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.text}</td>
                <td>
                  <div className="adm__actions">
                    <button onClick={() => openEdit(s)} className="adm__btn adm__btn--sm">Edit</button>
                    <button onClick={() => handleDelete(s.no)} className="adm__btn adm__btn--sm adm__btn--danger">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {steps.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--ink-faint)" }}>No steps yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
