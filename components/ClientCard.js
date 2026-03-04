'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ClientCard({ title, description, href }) {
  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card"
    >
      <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-600">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center text-sm font-semibold text-accent transition hover:opacity-80"
      >
        View onboarding guide →
      </Link>
    </motion.article>
  );
}
