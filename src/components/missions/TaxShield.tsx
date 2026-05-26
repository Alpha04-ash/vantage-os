"use client";

import React, { useState } from "react";
import { useVantageStore } from "@/store/useVantageStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

interface MissionModalProps {
  onClose: () => void;
}

const TAX_ITEMS = [
  { id: 1, text: "Business Travel",    type: "deduction", value: 500 },
  { id: 2, text: "Luxury Yacht",       type: "penalty",   value: -2000 },
  { id: 3, text: "Home Office",        type: "deduction", value: 300 },
  { id: 4, text: "Charity Donation",   type: "credit",    value: 1000 },
  { id: 5, text: "Unreported Income",  type: "penalty",   value: -5000 },
  { id: 6, text: "Education Expenses", type: "credit",    value: 800 },
];

export function TaxShield({ onClose }: MissionModalProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const { completeMission } = useVantageStore();

  const totalScore = selected.reduce((acc, id) => {
    const item = TAX_ITEMS.find(i => i.id === id);
    return acc + (item?.value || 0);
  }, 0);

  const handleFinish = () => {
    setIsFinished(true);
    if (totalScore > 0) {
      completeMission("tax-shield", 400, 100);
    }
  };

  const isPositive = totalScore >= 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0E11]/90 backdrop-blur-xl p-4">
      <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#1E2026] border border-[#2B2F36] max-w-xl w-full rounded-2xl p-8 relative">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-[#848E9C] hover:text-[#EAECEF] transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#F0B90B]/10 flex items-center justify-center text-[#F0B90B] border border-[#F0B90B]/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EAECEF] uppercase tracking-tight">Tax Shield</h3>
            <p className="text-[10px] text-[#848E9C] uppercase tracking-widest font-semibold mt-0.5">Mission: Real-time Audit Defense</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <p className="text-sm text-[#848E9C] leading-relaxed border-l-2 border-[#F0B90B]/30 pl-4">
                Scenario: The simulated IRS is auditing your venture. Select only the valid Deductions and Credits to shield your wealth. Avoid Penalties!
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {TAX_ITEMS.map((item) => {
                  const isSelected = selected.includes(item.id);
                  return (
                    <button 
                      key={item.id}
                      onClick={() => setSelected(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'bg-[#F0B90B]/10 border-[#F0B90B]/50 text-[#F0B90B]'
                          : 'bg-[#2B2F36] border-[#474D57] hover:border-[#848E9C] text-[#EAECEF]'
                      }`}
                    >
                      <div className="text-xs font-bold uppercase tracking-tight">{item.text}</div>
                      <div className={`text-xs font-mono mt-1 ${item.value > 0 ? 'text-[#F0B90B]' : 'text-[#F6465D]'}`}>
                        {item.value > 0 ? '+' : ''}{item.value}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Score Display */}
              <div className="p-4 rounded-xl bg-[#2B2F36] border border-[#474D57] flex justify-between items-center">
                <span className="text-xs uppercase font-semibold text-[#848E9C] tracking-widest">Calculated Shield</span>
                <span className={`text-xl font-mono font-bold ${isPositive ? "text-[#F0B90B]" : "text-[#F6465D]"}`}>
                  {isPositive ? "+" : ""}{totalScore}
                </span>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full py-3.5 rounded-xl bg-[#F0B90B] text-black font-bold uppercase tracking-wider hover:bg-[#F8D33A] transition-colors"
              >
                Submit Audit
              </button>
            </motion.div>
          ) : (
            <motion.div key="finish" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-6">
              <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center ${totalScore > 0 ? 'bg-[#F0B90B]/15 text-[#F0B90B]' : 'bg-[#F6465D]/15 text-[#F6465D]'}`}>
                {totalScore > 0 ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-[#EAECEF] uppercase tracking-tight mb-2">
                  {totalScore > 0 ? "Audit Survived" : "Audit Failure"}
                </h4>
                <p className="text-sm text-[#848E9C] leading-relaxed max-w-sm mx-auto">
                  {totalScore > 0
                    ? `You successfully shielded $${totalScore} sim-credits from the audit. Excellent record-keeping.`
                    : "You tried to deduct luxury items or failed to report income. Your wealth has been penalized."}
                </p>
              </div>
              <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-[#F0B90B] text-black font-bold uppercase tracking-wider hover:bg-[#F8D33A] transition-colors">
                Close Mission
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
