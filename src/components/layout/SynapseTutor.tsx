"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Send, Sparkles, AlertCircle, RefreshCw, CornerDownLeft } from "lucide-react";
import { useVantageStore } from "@/store/useVantageStore";
import { generateSynapseResponse } from "@/services/aiOracle";

declare var pendo: any;

const SYNAPSE_AGENT_ID = "5goOAE0liKfeZ54h-ByzxCtrbi8";

interface Message {
  sender: "user" | "synapse";
  text: string;
  timestamp: string;
}

export function SynapseTutor() {
  const { learningXP } = useVantageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "synapse",
      text: "VANTAGE SYSTEM DIRECTIVE: Synapse Artificial Intelligence initialized. System status calibration confirmed. Submit your inquiries regarding sovereign finance, system operations, and reserve banking below.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef(crypto.randomUUID());

  const presets = [
    { label: "ARR/CAC Rules", query: "Explain the optimal ARR recovery and CAC optimization mechanisms under VANTAGE protocol constraints." },
    { label: "Bank Leverage", query: "What is the optimal strategic framework for utilizing Central Bank credit lines and high-yield savings reserves?" },
    { label: "Liquidity Strategy", query: "Should I focus my capital allocation on cash reserves, real estate, cash-flow businesses, or volatile crypto assets?" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend: string, isSuggestedPrompt = false) => {
    if (!textToSend.trim() || loading) return;

    const promptMessageId = crypto.randomUUID();

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    if (typeof pendo !== "undefined") {
      pendo.trackAgent("prompt", {
        agentId: SYNAPSE_AGENT_ID,
        conversationId: conversationIdRef.current,
        messageId: promptMessageId,
        content: textToSend,
        suggestedPrompt: isSuggestedPrompt,
      });
    }

    try {
      const responseText = await generateSynapseResponse(textToSend, learningXP);
      if (typeof pendo !== "undefined") {
        pendo.track("ai_advisor_queried", {
          queryText: textToSend.substring(0, 100),
          isPresetQuery: presets.some(p => p.query === textToSend),
          learningXP,
          responseLength: responseText.length
        });
      }
      
      setMessages(prev => [...prev, {
        sender: "synapse",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      if (typeof pendo !== "undefined") {
        pendo.trackAgent("agent_response", {
          agentId: SYNAPSE_AGENT_ID,
          conversationId: conversationIdRef.current,
          messageId: crypto.randomUUID(),
          content: responseText,
          modelUsed: "gemini-2.5-flash-lite",
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: "synapse",
        text: "NEURAL_ERROR: Connection interrupted. Syncing with local database was successful.\n• Retrying connection...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 sm:bottom-14 right-4 sm:right-8 z-[490]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-5 py-4 sm:py-3.5 min-h-[48px] bg-[#1E2026] backdrop-blur-md border rounded-full transition-all group shadow-[0_0_30px_rgba(240,185,11,0.15)] ${
            isOpen
              ? "border-[#F0B90B] text-[#F0B90B]"
              : "border-[#2B2F36] hover:border-[#F0B90B]/50 text-[#848E9C] hover:text-[#EAECEF]"
          }`}
        >
          <div className="relative">
            <Brain className={`w-5 h-5 ${isOpen ? "animate-pulse text-[#F0B90B]" : "text-[#848E9C]/60 group-hover:text-[#F0B90B] transition-colors"}`} />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F0B90B] animate-ping" />
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
            Synapse AI
          </span>
        </button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 sm:bottom-32 right-0 sm:right-8 w-full sm:w-96 h-[60vh] sm:h-[520px] bg-[#1E2026] backdrop-blur-xl border-t sm:border border-[#2B2F36] sm:rounded-2xl z-[490] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] pb-safe"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#2B2F36] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-pulse shadow-[0_0_8px_rgba(240,185,11,0.8)]" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#EAECEF]">SYNAPSE // AI NEURAL ASSISTANT</div>
                  <div className="text-[8px] font-mono text-[#F0B90B]/80 uppercase tracking-widest mt-0.5">DIRECT GEMINI SYSTEM INTERFACE ACTIVE</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#848E9C] hover:text-[#EAECEF] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Stream */}
            <div
              ref={scrollRef}
              className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar font-mono text-xs text-[#EAECEF] bg-[#14151a]"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col space-y-1.5 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[8px] font-bold uppercase text-[#848E9C]/40 tracking-widest">
                    {msg.sender === "user" ? "OPERATOR" : "SYNAPSE_AI"} _ {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[85%] p-3 rounded-xl border whitespace-pre-line leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#2B2F36]/50 border-[#2B2F36] text-[#EAECEF]"
                        : "bg-[#F0B90B]/5 border-[#F0B90B]/15 text-[#F0B90B] shadow-[0_0_15px_rgba(240,185,11,0.02)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex flex-col space-y-1.5 items-start">
                  <span className="text-[8px] font-bold uppercase text-[#848E9C]/40 tracking-widest">
                    SYNAPSE_AI _ PROCESSING...
                  </span>
                  <div className="bg-[#F0B90B]/5 border border-[#F0B90B]/15 p-3 rounded-xl flex items-center gap-3">
                    <RefreshCw className="w-3.5 h-3.5 text-[#F0B90B] animate-spin" />
                    <span className="text-[10px] text-[#F0B90B]/80 uppercase tracking-widest animate-pulse font-mono">
                      Decrypting neural insights...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Presets and Controls */}
            <div className="p-4 border-t border-[#2B2F36] bg-[#1E2026] space-y-4">
              {messages.length === 1 && (
                <div className="space-y-2">
                  <div className="text-[8px] font-bold text-[#848E9C]/60 uppercase tracking-widest">Suggested Inquiries</div>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p.query, true)}
                        className="px-2.5 py-1.5 bg-[#2B2F36]/40 border border-[#2B2F36] hover:border-[#F0B90B]/30 text-[9px] uppercase tracking-wider text-[#848E9C] hover:text-[#F0B90B] transition-all rounded-lg font-mono"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-3 bg-[#14151a] border border-[#2B2F36] focus-within:border-[#F0B90B] p-2 rounded-xl transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Synapse AI anything..."
                  className="flex-1 bg-transparent border-none outline-none text-sm sm:text-xs font-mono text-[#EAECEF] placeholder-[#848E9C]/45 px-2"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 min-w-[44px] min-h-[44px] border border-[#2B2F36] hover:border-[#F0B90B]/50 text-[#848E9C]/60 hover:text-[#F0B90B] disabled:opacity-30 disabled:hover:text-[#848E9C]/60 disabled:border-[#2B2F36] transition-all rounded-lg flex items-center justify-center bg-[#2B2F36]/20"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
