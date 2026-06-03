"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { useCart } from "@/components/cart";
import { Reveal, Eyebrow } from "@/components/atoms";

type PayMethod = "esewa" | "khalti" | "card" | "bank";

export default function CheckoutPage() {
  const { items, total, remove, clear } = useCart();
  const [method, setMethod] = useState<PayMethod>("esewa");
  const [step, setStep] = useState<"review" | "payment" | "success">("review");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "",
    cardNumber: "", cardExpiry: "", cardCvv: "",
    esewaId: "", khaltiId: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handlePayment = (e: FormEvent) => {
    e.preventDefault();
    setStep("success");
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
              <h2 className="display h-md">Payment Successful</h2>
              <p className="serif-body" style={{ marginTop: "1rem" }}>
                Thank you for your purchase, {form.name || "collector"}. You will receive a confirmation email shortly with shipping details.
              </p>
              <p className="meta" style={{ marginTop: "1.5rem" }}>
                Order Total: <strong>Rs {total.toLocaleString()}</strong> &middot; Paid via {method === "esewa" ? "eSewa" : method === "khalti" ? "Khalti" : method === "card" ? "Card" : "Bank Transfer"}
              </p>
              <Link href="/" className="btn" style={{ marginTop: "2rem", display: "inline-flex" }} onClick={() => clear()}>
                Back to Home <span className="arr">&rarr;</span>
              </Link>
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
                        { id: "esewa" as const, label: "eSewa", desc: "Pay with eSewa wallet" },
                        { id: "khalti" as const, label: "Khalti", desc: "Pay with Khalti wallet" },
                        { id: "card" as const, label: "Card", desc: "Visa / Mastercard" },
                        { id: "bank" as const, label: "Bank Transfer", desc: "Direct bank transfer" },
                      ]).map((m) => (
                        <button
                          key={m.id}
                          className={`pay-method ${method === m.id ? "on" : ""}`}
                          onClick={() => setMethod(m.id)}
                        >
                          <span className="pay-method__label">{m.label}</span>
                          <span className="meta">{m.desc}</span>
                        </button>
                      ))}
                    </div>

                    <form className="checkout-form" onSubmit={handlePayment} style={{ marginTop: "1.5rem" }}>
                      {method === "esewa" && (
                        <div className="field">
                          <label className="field__label">eSewa ID / Phone</label>
                          <input type="text" required value={form.esewaId} onChange={(e) => set("esewaId", e.target.value)} placeholder="98XXXXXXXX" />
                        </div>
                      )}

                      {method === "khalti" && (
                        <div className="field">
                          <label className="field__label">Khalti ID / Phone</label>
                          <input type="text" required value={form.khaltiId} onChange={(e) => set("khaltiId", e.target.value)} placeholder="98XXXXXXXX" />
                        </div>
                      )}

                      {method === "card" && (
                        <>
                          <div className="field">
                            <label className="field__label">Card Number</label>
                            <input type="text" required value={form.cardNumber} onChange={(e) => set("cardNumber", e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19} />
                          </div>
                          <div className="cm-row2">
                            <div className="field">
                              <label className="field__label">Expiry</label>
                              <input type="text" required value={form.cardExpiry} onChange={(e) => set("cardExpiry", e.target.value)} placeholder="MM / YY" maxLength={7} />
                            </div>
                            <div className="field">
                              <label className="field__label">CVV</label>
                              <input type="text" required value={form.cardCvv} onChange={(e) => set("cardCvv", e.target.value)} placeholder="123" maxLength={4} />
                            </div>
                          </div>
                        </>
                      )}

                      {method === "bank" && (
                        <div className="pay-bank-info">
                          <p className="serif-body" style={{ margin: 0 }}>Transfer to the following account:</p>
                          <div className="pay-bank-details">
                            <div><span className="meta">Bank</span><span>Nepal Investment Mega Bank</span></div>
                            <div><span className="meta">Account Name</span><span>Duluwa Art Pvt. Ltd.</span></div>
                            <div><span className="meta">Account No.</span><span>01234567890123</span></div>
                            <div><span className="meta">Amount</span><span style={{ color: "var(--gold)", fontWeight: 600 }}>Rs {total.toLocaleString()}</span></div>
                          </div>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "1rem", marginTop: ".5rem" }}>
                        <button type="button" className="btn" onClick={() => setStep("review")}
                          style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" }}>
                          Back
                        </button>
                        <button type="submit" className="btn" style={{ flex: 1, justifyContent: "center" }}>
                          Pay Rs {total.toLocaleString()} <span className="arr">&rarr;</span>
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
