"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { register, AuthState } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(register, undefined);

  return (
    <div className="auth-split">
      <div className="auth-split__img">
        <Image
          src="/assets/auth-brushes.png"
          alt="Traditional bamboo paintbrushes held by a child's hand"
          fill
          priority
          sizes="50vw"
          style={{ objectFit: "cover" }}
        />
        <div className="auth-split__img-overlay" />
        <div className="auth-split__img-text">
          <Link href="/" className="auth-split__brand">
            <img src="/assets/logo.jpg" alt="Duluwa Art Gallery" className="auth-split__logo" />
          </Link>
          <blockquote className="auth-split__quote">
            Every brushstroke carries the weight of tradition and the lightness of a child&apos;s wonder.
          </blockquote>
        </div>
      </div>

      <div className="auth-split__form">
        <div className="auth-split__form-inner">
          <div className="auth-split__form-top">
            <Link href="/" className="auth-split__back">
              <span className="arr">&larr;</span> Back to gallery
            </Link>
          </div>

          <div className="auth-split__form-content">
            <div className="auth-split__heading">
              <span className="eyebrow"><span className="idx">02</span> Join Us</span>
              <h1 className="display h-md">Create Account</h1>
              <p className="serif-body">Become part of the Duluwa Art community.</p>
            </div>

            {state?.error && <div className="auth-error">{state.error}</div>}

            <form action={action} className="auth-form">
              <div className="field">
                <label className="field__label" htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="Min. 6 characters" required />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="confirm">Confirm Password</label>
                <input id="confirm" name="confirm" type="password" placeholder="Repeat password" required />
              </div>
              <button type="submit" className="btn" style={{ width: "100%", justifyContent: "center", marginTop: ".6rem" }} disabled={pending}>
                {pending ? "Creating…" : "Create Account"} <span className="arr">&rarr;</span>
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{" "}
              <Link href="/login" className="link-u" style={{ fontSize: "inherit", letterSpacing: "normal", textTransform: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
