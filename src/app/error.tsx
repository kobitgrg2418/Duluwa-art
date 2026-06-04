"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: "#FAF8F3",
        color: "#232120",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 300, margin: "0 0 1rem" }}>
        Something went wrong
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#5B554C", maxWidth: "40ch", marginBottom: "2rem" }}>
        An unexpected error occurred. Please try again, or return to the homepage.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "1em 2em",
            fontFamily: "'Helvetica Neue', sans-serif",
            fontSize: ".74rem",
            fontWeight: 500,
            letterSpacing: ".2em",
            textTransform: "uppercase" as const,
            background: "#232120",
            color: "#FAF8F3",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: "1em 2em",
            fontFamily: "'Helvetica Neue', sans-serif",
            fontSize: ".74rem",
            fontWeight: 500,
            letterSpacing: ".2em",
            textTransform: "uppercase" as const,
            border: "1px solid #232120",
            color: "#232120",
            textDecoration: "none",
          }}
        >
          Go home
        </a>
      </div>
    </div>
  );
}
