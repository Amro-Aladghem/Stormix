import { motion } from "motion/react";

export default function TornadoMark() {
  return (
    <motion.span
      className="inline-flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground font-black text-lg select-none"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.95 }}
    >
      S
    </motion.span>
  );
}
