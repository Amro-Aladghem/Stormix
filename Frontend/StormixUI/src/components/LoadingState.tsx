import { motion } from "motion/react";

interface LoadingStateProps {
  query: string;
}

export default function LoadingState({ query }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-32 gap-6"
    >
      <div className="tornado" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground font-medium flex items-center gap-1"
      >
        <span>Searching for</span>
        <span className="text-foreground font-bold">“{query}”</span>
        <span>…</span>
      </motion.div>
    </motion.div>
  );
}
