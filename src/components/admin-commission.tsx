"use client";

import { useState } from "react";
import { adminSaveCommissionPricing } from "@/app/actions/admin";
import type { CommissionTier } from "@/lib/store";

export function CommissionPricingManager({ initialTiers }: { initialTiers: CommissionTier[] }) {
  const [tiers, setTiers] = useState<CommissionTier[]>(initialTiers);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string } | null>(null);

  function update(idx: number, field: keyof CommissionTier, value: string) {
    setTiers((prev) => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  }

  function addTier() {
    setTiers((prev) => [...prev, { label: "", price: "", desc: "" }]);
  }

  function removeTier(idx: number) {
    if (tiers.length <= 1) return;
    setTiers((prev) => prev.filter((_, i) => i !== idx));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const result = await adminSaveCommissionPricing(tiers);
    setMsg(result ?? null);
    setSaving(false);
  }

  return (
    <div>
      {msg?.ok && <div className="adm__success">Pricing saved successfully!</div>}
      {msg?.error && <div className="adm__error">{msg.error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 700 }}>
        {tiers.map((tier, i) => (
          <div key={i} className="adm__panel" style={{ padding: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".8rem" }}>
              <span style={{ fontWeight: 600, fontSize: ".85rem", color: "#6366f1" }}>Tier {i + 1}</span>
              {tiers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTier(i)}
                  className="adm__btn adm__btn--sm adm__btn--danger"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="adm__form-grid">
              <div className="adm__field">
                <label>Label *</label>
                <input
                  value={tier.label}
                  onChange={(e) => update(i, "label", e.target.value)}
                  placeholder="e.g. Small, Medium, Large"
                />
              </div>
              <div className="adm__field">
                <label>Price *</label>
                <input
                  value={tier.price}
                  onChange={(e) => update(i, "price", e.target.value)}
                  placeholder="e.g. Rs 48,000"
                />
              </div>
              <div className="adm__field adm__field--full">
                <label>Description</label>
                <input
                  value={tier.desc}
                  onChange={(e) => update(i, "desc", e.target.value)}
                  placeholder="e.g. up to 30 × 40 cm · sketch & portrait studies"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: ".8rem", marginTop: "1.2rem" }}>
        <button type="button" onClick={addTier} className="adm__btn">
          + Add Tier
        </button>
        <button
          type="button"
          onClick={save}
          className="adm__btn adm__btn--primary"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Pricing"}
        </button>
      </div>
    </div>
  );
}
