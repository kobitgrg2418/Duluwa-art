import Link from "next/link";

export default function NotFound() {
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
      <p
        style={{
          fontFamily: "'Helvetica Neue', sans-serif",
          fontSize: ".7rem",
          fontWeight: 500,
          letterSpacing: ".3em",
          textTransform: "uppercase",
          color: "#A6843E",
          marginBottom: "1rem",
        }}
      >
        404
      </p>
      <h1 style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: 300, margin: "0 0 1rem" }}>
        Page not found
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#5B554C", maxWidth: "40ch", marginBottom: "2rem" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          padding: "1em 2em",
          fontFamily: "'Helvetica Neue', sans-serif",
          fontSize: ".74rem",
          fontWeight: 500,
          letterSpacing: ".2em",
          textTransform: "uppercase",
          background: "#232120",
          color: "#FAF8F3",
          border: "none",
          textDecoration: "none",
        }}
      >
        Return home
      </Link>
    </div>
  );
}
