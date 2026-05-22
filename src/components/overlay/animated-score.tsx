"use client";

import { memo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedScoreProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedScore = memo(function AnimatedScore({
  value,
  className,
  style,
}: AnimatedScoreProps) {
  const prev = useRef(value);
  const changed = prev.current !== value;

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return (
    <motion.span
      key={changed ? `score-${value}` : "score-stable"}
      className={className}
      style={{ ...style, display: "inline-block", transformOrigin: "center bottom" }}
      initial={
        changed
          ? { scale: 1.4, y: -12, rotateX: -75, opacity: 0.6 }
          : false
      }
      animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.8 }}
    >
      {value}
    </motion.span>
  );
});
