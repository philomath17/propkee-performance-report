import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import ClientCard from '@/components/ClientCard';
import { homeCarouselSlides, onboardingTypes } from '@/data/onboardingData';

const cardOrder = ['agent', 'agency', 'developer', 'influencer'];

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-10">
        <section className="rounded-3xl bg-gradient-to-br from-white to-amber-50 p-8 shadow-card md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Internal Knowledge Hub</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Propkee onboarding portal for every partner track.
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-600">
            Access modern onboarding playbooks, embedded training media, and compliance workflows from a single source.
          </p>
        </section>

        <section className="mt-10">
          <Carousel slides={homeCarouselSlides} />
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cardOrder.map((type) => (
            <ClientCard
              key={type}
              title={onboardingTypes[type].title.replace(' Onboarding', '')}
              description={onboardingTypes[type].audienceSummary}
              href={`/onboarding/${type}`}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
