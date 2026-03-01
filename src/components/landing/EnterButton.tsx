'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CINEMATIC_EASE } from '@/lib/animations';

export function EnterButton() {
  return (
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
  );
}
