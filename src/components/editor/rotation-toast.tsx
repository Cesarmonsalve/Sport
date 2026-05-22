"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEditorStore } from "@/lib/store/editor-store";

export function RotationToast() {
  const msg = useEditorStore((s) => s.rotationNotice);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed bottom-20 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-primary/40 bg-card/95 px-4 py-2 text-xs text-primary shadow-lg"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
