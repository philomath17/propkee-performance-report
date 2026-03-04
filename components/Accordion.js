'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Accordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = index === activeIndex;
        return (
          <article key={item.title} className="overflow-hidden rounded-xl border border-zinc-200">
            <button
              type="button"
              onClick={() => setActiveIndex(open ? -1 : index)}
              className="flex w-full items-center justify-between bg-zinc-50 px-4 py-3 text-left"
            >
              <span className="font-medium text-zinc-900">{item.title}</span>
              <span className="text-accent">{open ? '−' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-4 py-3 text-sm leading-6 text-zinc-700">{item.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}
