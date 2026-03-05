export default function SidebarNav({ sections }) {
  return (
    <aside className="sticky top-24 h-fit rounded-2xl border border-zinc-200 bg-white p-4 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">On this page</p>
      <nav className="mt-4 space-y-2 text-sm">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="block rounded-lg px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-accent">
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
