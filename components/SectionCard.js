export default function SectionCard({ id, title, children }) {
  return (
    <section id={id} className="section-anchor rounded-2xl border border-zinc-200 bg-white p-6 shadow-card">
      <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
      <div className="mt-4 space-y-4 text-zinc-700">{children}</div>
    </section>
  );
}
