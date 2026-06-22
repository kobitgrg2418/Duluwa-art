import { useState, FormEvent } from "react";
import Link from "@/components/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart";
import { Reveal, Eyebrow } from "@/components/atoms";
import { api } from "@/lib/api";

type PayMethod = "esewa" | "khalti" | "card" | "bank";

export default function CheckoutPage() {
  const { items, total, remove, clear } = useCart();
  const [method, setMethod] = useState<PayMethod>("esewa");
  const [step, setStep] = useState<"review" | "payment" | "success">("review");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placedTotal, setPlacedTotal] = useState(0);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "",
    esewaId: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await api.post("/api/orders", {
        paymentMethod: method,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        items: items.map((i) => ({ artworkId: i.artwork.id, qty: i.qty })),
        reference: method === "esewa" ? form.esewaId : undefined,
      });
      setPlacedTotal(res.total);
      clear();
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <>
        <Nav />
        <main>
          <section className="section" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <h2 className="display h-md">Your cart is empty</h2>
              <p className="serif-body" style={{ marginTop: "1rem", opacity: 0.6 }}>Add some artwork to get started.</p>
              <Link href="/collections" className="btn" style={{ marginTop: "2rem", display: "inline-flex" }}>
                Browse Collections <span className="arr">&rarr;</span>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <Nav />
        <main>
          <section className="section" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", maxWidth: "480px" }}>
              <div className="cm-thanks-mark" style={{ margin: "0 auto 1.5rem" }}>&#x2713;</div>
              <h2 className="display h-md">Order Placed</h2>
              <p className="serif-body" style={{ marginTop: "1rem" }}>
                Thank you, {form.name || "collector"}. We&rsquo;ve emailed your order confirmation to {form.email || "your inbox"}. Once we verify your payment, you&rsquo;ll receive a payment-confirmation email and we&rsquo;ll prepare your artwork for shipping.
              </p>
              <p className="meta" style={{ marginTop: "1.5rem" }}>
                Order Total: <strong>Rs {placedTotal.toLocaleString()}</strong> &middot; via {method === "bank" ? "Nabil Bank" : "eSewa"}
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem", flexWrap: "wrap" }}>
                <Link href="/profile#orders" className="btn" style={{ display: "inline-flex" }}>
                  View My Orders <span className="arr">&rarr;</span>
                </Link>
                <Link href="/" className="btn" style={{ display: "inline-flex", background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" }}>
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <header className="cp-hero">
          <div className="wrap">
            <Reveal><Eyebrow>Checkout</Eyebrow></Reveal>
            <Reveal delay={1}><h1 className="display h-xl">Complete Your Order</h1></Reveal>
          </div>
        </header>

        <section className="section--tight section">
          <div className="wrap">
            <div className="checkout-grid">
              {/* Left: Order Summary */}
              <div className="checkout-summary">
                <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>Order Summary</h3>
                <div className="checkout-items">
                  {items.map((item) => (
                    <div key={item.artwork.id} className="checkout-row">
                      <div className="checkout-row__info">
                        <span className="checkout-row__title">{item.artwork.title}</span>
                        <span className="meta">{item.artwork.size} &middot; {item.artwork.year}</span>
                      </div>
                      <div className="checkout-row__right">
                        <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem" }}>Rs {item.artwork.price.toLocaleString()}</span>
                        <button className="cart-item__rm" onClick={() => remove(item.artwork.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="checkout-totals">
                  <div className="checkout-totals__row">
                    <span className="meta">Subtotal</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>
                  <div className="checkout-totals__row">
                    <span className="meta">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="checkout-totals__row checkout-totals__grand">
                    <span>Total</span>
                    <span className="display" style={{ fontSize: "1.6rem", color: "var(--gold)" }}>Rs {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Right: Payment */}
              <div className="checkout-pay">
                {step === "review" && (
                  <>
                    <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>Shipping Details</h3>
                    <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); setStep("payment"); }}>
                      <div className="cm-row2">
                        <div className="field">
                          <label className="field__label">Full Name</label>
                          <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Kobit Gurung" />
                        </div>
                        <div className="field">
                          <label className="field__label">Phone</label>
                          <input type="tel" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+977 98XXXXXXXX" />
                        </div>
                      </div>
                      <div className="field">
                        <label className="field__label">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
                      </div>
                      <div className="field">
                        <label className="field__label">Shipping Address</label>
                        <input type="text" required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, Ward, Tole" />
                      </div>
                      <div className="field">
                        <label className="field__label">City</label>
                        <input type="text" required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Kathmandu" />
                      </div>
                      <button type="submit" className="btn" style={{ width: "100%", justifyContent: "center" }}>
                        Continue to Payment <span className="arr">&rarr;</span>
                      </button>
                    </form>
                  </>
                )}

                {step === "payment" && (
                  <>
                    <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>Payment Method</h3>
                    <div className="pay-methods">
                      {([
                        { id: "esewa" as const, label: "eSewa", desc: "Scan QR to pay", soon: false },
                        { id: "bank" as const, label: "Bank Transfer", desc: "Nabil Bank QR", soon: false },
                        { id: "khalti" as const, label: "Khalti", desc: "Coming soon", soon: true },
                        { id: "card" as const, label: "Card", desc: "Coming soon", soon: true },
                      ]).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          disabled={m.soon}
                          className={`pay-method ${method === m.id ? "on" : ""} ${m.soon ? "is-soon" : ""}`}
                          onClick={() => !m.soon && setMethod(m.id)}
                        >
                          <span className="pay-method__label">{m.label}</span>
                          <span className="meta">{m.desc}</span>
                        </button>
                      ))}
                    </div>

                    <form className="checkout-form" onSubmit={handlePayment} style={{ marginTop: "1.5rem" }}>
                      {method === "esewa" && (
                        <>
                          <div className="pay-qr">
                            <img className="pay-qr__img" src="/assets/esewa-qr.jpeg" alt="eSewa payment QR for Kobit Gurung" />
                            <div className="pay-qr__meta">
                              <span className="pay-qr__name">Kobit Gurung &middot; 9826629985</span>
                              <span className="meta">Scan with your eSewa app to pay <strong style={{ color: "var(--gold)" }}>Rs {total.toLocaleString()}</strong></span>
                            </div>
                          </div>
                          <div className="field">
                            <label className="field__label">eSewa Transaction ID <span className="meta">(after payment)</span></label>
                            <input type="text" value={form.esewaId} onChange={(e) => set("esewaId", e.target.value)} placeholder="e.g. 0AB1CD2" />
                          </div>
                        </>
                      )}

                      {method === "bank" && (
                        <div className="pay-bank-info">
                          <p className="serif-body" style={{ margin: 0 }}>Scan the QR with your mobile banking or any QR-enabled app:</p>
                          <div className="pay-qr">
                            <img className="pay-qr__img" src="/assets/nabil-qr.png" alt="Nabil Bank payment QR" />
                            <div className="pay-qr__meta">
                              <span className="pay-qr__name">Nabil Bank</span>
                              <span className="meta">Amount to pay <strong style={{ color: "var(--gold)" }}>Rs {total.toLocaleString()}</strong></span>
                            </div>
                          </div>
                        </div>
                      )}

                      {error && (
                        <p className="meta" role="alert" style={{ color: "#c0392b", marginTop: ".25rem" }}>{error}</p>
                      )}

                      <div style={{ display: "flex", gap: "1rem", marginTop: ".5rem" }}>
                        <button type="button" className="btn" onClick={() => setStep("review")} disabled={submitting}
                          style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" }}>
                          Back
                        </button>
                        <button type="submit" className="btn" disabled={submitting} style={{ flex: 1, justifyContent: "center", opacity: submitting ? 0.6 : 1 }}>
                          {submitting ? "Placing Order…" : <>Confirm Order &middot; Rs {total.toLocaleString()} <span className="arr">&rarr;</span></>}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
