'use client';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#f4f1ec', color: '#111', padding: '12vh 24px', maxWidth: 640, margin: '0 auto' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.6 }}>Duluwa Art</p>
        <h1 style={{ fontSize: 48, lineHeight: 1, margin: '12px 0' }}>Can&apos;t reach the backend</h1>
        <p style={{ lineHeight: 1.6, opacity: 0.75 }}>
          The site loads its content from the Django CMS at <code>{API}</code>. Start the backend (<code>backend/start.sh</code> or <code>backend\start.bat</code>), check <code>NEXT_PUBLIC_API_URL</code> in <code>frontend/.env.local</code>, then reload.
        </p>
        <button onClick={reset} style={{ marginTop: 24, padding: '14px 22px', background: '#111', color: '#fff', border: 0, cursor: 'pointer' }}>Try again</button>
      </body>
    </html>
  );
}
