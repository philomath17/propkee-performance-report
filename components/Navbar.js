import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          Propkee <span className="text-accent">Onboarding Portal</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-700">
          <Link href="/" className="transition hover:text-accent">Home</Link>
          <Link href="/admin-panel" className="transition hover:text-accent">Admin Panel</Link>
        </nav>
      </div>
    </header>
  );
}
