'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Carousel({ slides }) {
  const [index, setIndex] = useState(0);

  const slide = useMemo(() => slides[index], [slides, index]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 shadow-card">
      <div className="min-h-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">About Propkee</p>
            <h3 className="mt-2 text-2xl font-semibold text-zinc-900">{slide.title}</h3>
            <p className="mt-3 max-w-2xl text-zinc-600">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition ${i === index ? 'w-10 bg-accent' : 'w-2.5 bg-zinc-300'}`}
            aria-label={`Go to ${s.title}`}
          />
        ))}
      </div>
    </div>
  );
}
