'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CINEMATIC_EASE } from '@/lib/animations';

export function EnterButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: CINEMATIC_EASE }}
      >
        <Link href="/quiz">
          <motion.span
            className="inline-block px-10 py-4 text-lg font-sans font-medium text-background bg-accent rounded-full cursor-pointer select-none"
            whileHover={{ scale: 1.04, backgroundColor: '#E8D5A3' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: CINEMATIC_EASE }}
          >
            Find out.
          </motion.span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6, ease: CINEMATIC_EASE }}
        className="flex items-center gap-1.5 font-sans text-sm"
        style={{ color: '#9A9590' }}
      >
        <span>or, if you know</span>
        <Link
          href="/oneshot"
          className="transition-colors hover:text-text underline underline-offset-2"
          style={{ color: '#9A9590' }}
        >
          one shot →
        </Link>
      </motion.div>
    </div>
  );
}
