"use client";

import React from "react";
import { motion } from "framer-motion";

interface SceneTransitionProps {
  children: React.ReactNode;
  direction: "forward" | "backward";
  style: string;
}

export function SceneTransition({ children, direction, style }: SceneTransitionProps) {
  const isForward = direction === "forward";

  // TRANSITION VARIANTS
  const variants = {
    "neural-zoom": {
      initial: { opacity: 0, scale: isForward ? 0.8 : 1.2, filter: "blur(20px)", z: isForward ? -500 : 500 },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)", z: 0 },
      exit: { opacity: 0, scale: isForward ? 1.2 : 0.8, filter: "blur(20px)", z: isForward ? 500 : -500 },
    },
    "network-flow": {
      initial: { opacity: 0, x: isForward ? 500 : -500, rotateY: isForward ? 45 : -45, perspective: 1000 },
      animate: { opacity: 1, x: 0, rotateY: 0 },
      exit: { opacity: 0, x: isForward ? -500 : 500, rotateY: isForward ? -45 : 45 },
    },
    "block-stack": {
      initial: { opacity: 0, rotateX: isForward ? 90 : -90, y: isForward ? 200 : -200 },
      animate: { opacity: 1, rotateX: 0, y: 0 },
      exit: { opacity: 0, rotateX: isForward ? -90 : 90, y: isForward ? -200 : 200 },
    },
    "growth-path": {
      initial: { opacity: 0, scale: 0.5, rotateZ: isForward ? 10 : -10, y: 100 },
      animate: { opacity: 1, scale: 1, rotateZ: 0, y: 0 },
      exit: { opacity: 0, scale: 1.5, rotateZ: isForward ? -10 : 10, y: -100 },
    },
    "pressure-stack": {
      initial: { opacity: 0, scaleY: 0.5, y: isForward ? 500 : -500 },
      animate: { opacity: 1, scaleY: 1, y: 0 },
      exit: { opacity: 0, scaleY: 0.5, y: isForward ? -500 : 500 },
    },
    "machine-engine": {
      initial: { opacity: 0, rotate: isForward ? 45 : -45, scale: 0.9 },
      animate: { opacity: 1, rotate: 0, scale: 1 },
      exit: { opacity: 0, rotate: isForward ? -45 : 45, scale: 1.1 },
    },
    "pixel-portal": {
      initial: { opacity: 0, filter: "brightness(2) contrast(2)", scale: 1.1 },
      animate: { opacity: 1, filter: "brightness(1) contrast(1)", scale: 1 },
      exit: { opacity: 0, filter: "brightness(0) contrast(2)", scale: 0.9 },
    },
    "open-horizon": {
      initial: { opacity: 0, scale: 0.9, filter: "brightness(5)" },
      animate: { opacity: 1, scale: 1, filter: "brightness(1)" },
      exit: { opacity: 0, scale: 1.1, filter: "brightness(0)" },
    }
  };

  const activeVariant = variants[style as keyof typeof variants] || variants["neural-zoom"];

  return (
    <motion.div
      variants={activeVariant}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[1200px] flex items-center justify-center relative"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
