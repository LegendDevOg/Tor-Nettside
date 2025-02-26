import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface AnimateProviderProps {
  children: ReactNode;  // Typing children as ReactNode
  className?: string;   // Typing className as optional string
}

function AnimateProvider({ children, className }: AnimateProviderProps) {
  return (
    <AnimatePresence>
      <motion.section
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  );
}

export default AnimateProvider;