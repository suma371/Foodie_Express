export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const scaleHover = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.96 },
};

export const slideUp = {
  hidden: { y: 80 },
  show: {
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const springScale = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: "spring", stiffness: 200, damping: 20 }
};

export const scrollReveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4, ease: "easeOut" }
};
