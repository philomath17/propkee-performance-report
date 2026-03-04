import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SidebarNav from '@/components/SidebarNav';
import SectionCard from '@/components/SectionCard';
import Accordion from '@/components/Accordion';
import VideoEmbed from '@/components/VideoEmbed';
import { onboardingTypes, sharedSections, onboardingSections } from '@/data/onboardingData';

export function generateStaticParams() {
  return Object.keys(onboardingTypes).map((type) => ({ type }));
}

export default function OnboardingTypePage({ params }) {
  const profile = onboardingTypes[params.type];

  if (!profile) notFound();

  return (
    <div>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 pt-10 lg:grid-cols-[260px_1fr]">
        <SidebarNav sections={onboardingSections} />

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-amber-50/40 p-6 shadow-card">
            <h1 className="text-3xl font-semibold text-zinc-900">{profile.title}</h1>
            <p className="mt-2 text-zinc-700">{profile.audienceSummary}</p>
          </section>

          <SectionCard id="sales-consent" title="Sales Consent Collection">
            <p>Capture explicit approvals and maintain evidentiary media for every lead handoff.</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sharedSections.salesConsentCollection.images.map((src) => (
                <img key={src} src={src} alt="Sales consent workflow" className="h-40 w-full rounded-xl object-cover" />
              ))}
            </div>
          </SectionCard>

          <SectionCard id="document-requirements" title="Document Requirements">
            <Accordion items={sharedSections.documentRequirements} />
          </SectionCard>

          <SectionCard id="verification-process" title="Verification Process">
            <p>{sharedSections.verificationProcess}</p>
          </SectionCard>

          <SectionCard id="admin-profile" title="Admin Profile Creation">
            <VideoEmbed title="Admin profile setup walkthrough" src={sharedSections.adminProfileVideo} />
          </SectionCard>

          <SectionCard id="reel-upload" title="Reel Upload Process">
            <VideoEmbed title="Reel upload process video" src={sharedSections.reelUploadVideo} />
          </SectionCard>

          <SectionCard id="welcome-email" title="Welcome Email">
            <p>Use the approved welcome mail creative as soon as profile verification is completed.</p>
            <img
              src={sharedSections.welcomeEmailImage}
              alt="Welcome email visual"
              className="h-72 w-full rounded-xl object-cover"
            />
          </SectionCard>

          <SectionCard id="listing-addition" title="Listing Addition Process">
            <VideoEmbed title="Listing addition process video" src={sharedSections.listingAdditionVideo} />
          </SectionCard>

          <SectionCard id="compliance" title="Ongoing Compliance & Maintenance">
            <p>{sharedSections.complianceMaintenance}</p>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
