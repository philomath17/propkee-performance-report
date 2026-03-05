import Navbar from '@/components/Navbar';
import VideoEmbed from '@/components/VideoEmbed';

const features = [
  'Role and permission management with granular module access.',
  'Lead lifecycle tracking from inquiry to closed onboarding.',
  'Document audit dashboard with rejection reasons and status history.',
  'Bulk partner communication tools for reminders and announcements.',
  'Compliance alerts for pending KYC renewals and policy acknowledgments.',
];

export default function AdminPanelPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-card md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Admin Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">Admin panel feature overview</h1>
          <p className="mt-3 text-zinc-600">
            This page explains every major capability available to Propkee administrators and operations managers.
          </p>
          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="rounded-lg bg-zinc-50 px-4 py-3 text-zinc-700">
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <VideoEmbed title="Admin dashboard tutorial" src="https://www.loom.com/embed/f8a8f8dd5b6f40f7ad80bc56d95d3f95" />
          <VideoEmbed title="Compliance queue walkthrough" src="https://www.loom.com/embed/8b287d088f7146198ff89e595f5ad2db" />
        </section>
      </main>
    </div>
  );
}
