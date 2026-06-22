import { useEffect, useCallback, useState, FormEvent } from "react";
import Link from "@/components/link";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { AuthSlideshow } from "@/components/auth-slideshow";

declare global {
  interface Window {
    handleGoogleCredential?: (response: { credential: string }) => void;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export default function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleGoogle = useCallback(
    async (response: { credential: string }) => {
      try {
        await api.post("/api/auth/google", { credential: response.credential });
        refresh();
        navigate("/");
      } catch {
        setError("Google sign-in failed. Please try again.");
      }
    },
    [navigate, refresh],
  );

  useEffect(() => {
    window.handleGoogleCredential = handleGoogle;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      delete window.handleGoogleCredential;
      script.remove();
    };
  }, [handleGoogle]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await api.post("/api/auth/login", { email: fd.get("email"), password: fd.get("password") });
      refresh();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setPending(false);
    }
  }

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

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
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

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div
              id="g_id_onload"
              data-client_id={GOOGLE_CLIENT_ID}
              data-callback="handleGoogleCredential"
              data-auto_prompt="false"
            />
            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
              data-width="360"
            />

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
