'use client';
import { useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="page-pad flex min-h-[80vh] flex-col items-start justify-center">
      <p className="label mb-4 text-mute">Something went wrong</p>
      <h1 className="display">Gallery<br />unavailable</h1>
      <p className="mt-6 max-w-[460px] text-ink/70">
        The page could not load its content from the backend at <code>{API}</code>. Make sure the Django server is running, then try again.
      </p>
      <button type="button" onClick={reset} className="btn mt-8">Try again</button>
    </section>
  );
}
