import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="page-pad flex min-h-[90vh] flex-col items-start justify-center pt-24">
      <p className="label mb-4 text-mute">404</p>
      <h1 className="display">Lost on<br />the trail</h1>
      <p className="mt-6 max-w-[380px] text-ink/70">That page does not exist. Some paths in the Himalaya end in a meadow; this one ends here.</p>
      <Link href="/shop" className="btn mt-8">Back to the shop</Link>
    </section>
  );
}
