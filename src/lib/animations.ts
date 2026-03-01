import type { Variants } from 'framer-motion';

// Shared easing
export const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

// Page-level transitions
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.4, ease: CINEMATIC_EASE },
  },
};

// Quiz step slides from right
export const stepVariants: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.35, ease: CINEMATIC_EASE },
  },
};

// Staggered children (option lists, card grids)
export const containerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const itemVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: CINEMATIC_EASE },
  },
};

// Fade in only
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// Scale pop for selections
export const selectVariants: Variants = {
  unselected: { scale: 1 },
  selected: {
    scale: 1.04,
    transition: { duration: 0.2, ease: CINEMATIC_EASE },
  },
};

// Loading transition text phases
export const loadingTextVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: CINEMATIC_EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3 },
  },
};
