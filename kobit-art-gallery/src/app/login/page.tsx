"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, AuthState } from "@/app/actions/auth";
import { AuthSlideshow } from "@/components/auth-slideshow";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, undefined);

  return (
    <div className="auth-split">
      <div className="auth-split__img">
        <AuthSlideshow />
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
              <span className="eyebrow"><span className="idx">01</span> Welcome Back</span>
              <h1 className="display h-md">Sign In</h1>
              <p className="serif-body">Enter your credentials to access your account.</p>
            </div>

            {state?.error && <div className="auth-error">{state.error}</div>}

            <form action={action} className="auth-form">
              <div className="field">
                <label className="field__label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="Your password" required />
              </div>
              <button type="submit" className="btn" style={{ width: "100%", justifyContent: "center", marginTop: ".6rem" }} disabled={pending}>
                {pending ? "Signing in…" : "Sign In"} <span className="arr">&rarr;</span>
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="link-u" style={{ fontSize: "inherit", letterSpacing: "normal", textTransform: "none" }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
