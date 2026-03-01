'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLATFORMS } from '@/data/platforms';

const STORAGE_KEY = 'moviePickerPlatforms';

export function PlatformPicker() {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelected(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function clearAll() {
    setSelected([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  // Avoid hydration mismatch — render nothing until mounted
  if (!mounted) return null;

  const selectedLabels = PLATFORMS.filter((p) => selected.includes(p.key)).map((p) => p.label);
  const collapsedText =
    selectedLabels.length > 0
      ? `${selectedLabels.join(', ')} ✓`
      : 'Where do you watch?';

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-muted text-xs font-sans tracking-wider hover:text-active transition-colors cursor-pointer"
      >
        {collapsedText}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden w-full"
          >
            <div className="flex flex-col gap-4 pt-2 pb-1">
              <div className="flex flex-wrap gap-2 justify-center">
                {PLATFORMS.map((platform) => {
                  const isSelected = selected.includes(platform.key);
                  return (
                    <button
                      key={platform.key}
                      onClick={() => toggle(platform.key)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans
                        transition-all duration-150 cursor-pointer
                        ${isSelected
                          ? 'ring-1 ring-active text-active bg-overlay'
                          : 'text-muted bg-card hover:text-text'
                        }
                      `}
                    >
                      <span className={`w-2 h-2 rounded-full ${platform.color} flex-shrink-0`} />
                      {platform.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted text-xs font-sans tracking-wider hover:text-text transition-colors cursor-pointer"
                >
                  Done
                </button>
                {selected.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-muted text-xs font-sans tracking-wider hover:text-text transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
