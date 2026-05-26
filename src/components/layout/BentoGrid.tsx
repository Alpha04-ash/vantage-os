"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function BentoItem({ children, className, delay = 0 }: BentoItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass glass-hover rounded-3xl p-6 overflow-hidden relative group",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto pt-32", className)}>
      {children}
    </div>
  );
}
