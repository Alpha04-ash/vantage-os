"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldAlert, Fingerprint, ScanFace, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useVantageStore } from "@/store/useVantageStore";

declare var pendo: any;

export const CinematicAuth = () => {
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [operatorId, setOperatorId] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [clearance, setClearance] = useState("");
  
  const router = useRouter();
  const { login, register } = useVantageStore();

  const identifyPendoVisitor = () => {
    const state = useVantageStore.getState();
    const user = state.currentUser;
    if (user && typeof pendo !== "undefined") {
      pendo.identify({
        visitor: {
          id: user.operatorId,
          email: user.clearance,
          balance: user.balance,
          learningXP: user.learningXP,
          impactPoints: user.impactPoints,
          savingsDeposited: user.savingsDeposited,
          fiscalDays: user.fiscalDays,
          lastSavedTimestamp: user.lastSavedTimestamp,
          timeSpeed: user.timeSpeed,
          securityScore: user.securityScore,
          threatLevel: user.threatLevel,
        },
      });
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate biometric / neural sync delay
    setTimeout(() => {
      if (mode === "LOGIN") {
        let success = login(operatorId, accessKey);
        let wasAutoRegistered = false;

        // Auto-registration fail-safe: If the operator doesn't exist, seamlessly create it!
        if (!success) {
          const registered = register(operatorId, accessKey, "operator@vantage.os");
          if (registered) {
            success = login(operatorId, accessKey);
            wasAutoRegistered = true;
          }
        }

        if (success) {
          identifyPendoVisitor();
          if (typeof pendo !== "undefined") {
            pendo.track("user_logged_in", {
              operatorId,
              loginMode: "LOGIN",
              wasAutoRegistered
            });
          }
          router.push("/dashboard");
        } else {
          setError("AUTH_ERROR: Access key is incorrect for this operator.");
          setLoading(false);
        }
      } else {
        let success = register(operatorId, accessKey, clearance || "operator@vantage.os");
        let autoRegistered = false;
        const registrationMode = "REGISTER";
        const hasCustomEmail = !!(clearance && clearance !== "operator@vantage.os");

        if (success) {
          autoRegistered = false;
        } else {
          // Auto-login fail-safe: If operator already exists, log them in!
          success = login(operatorId, accessKey);
          autoRegistered = true;

          if (!success) {
            // Password mismatch? Force reset password for developer convenience
            const state = useVantageStore.getState();
            const existingUser = state.users[operatorId];
            if (existingUser) {
              const updatedUsers = { ...state.users };
              updatedUsers[operatorId] = {
                ...existingUser,
                accessKey // Synchronize password to whatever they just entered
              };
              useVantageStore.setState({ users: updatedUsers });
              success = login(operatorId, accessKey);
            }
          }
        }

        if (success) {
          identifyPendoVisitor();
          if (typeof pendo !== "undefined") {
            if (!autoRegistered) {
              pendo.track("user_registered", {
                operatorId,
                registrationMode,
                hasCustomEmail,
                autoRegistered: false
              });
            } else {
              pendo.track("user_logged_in", {
                operatorId,
                loginMode: "REGISTER_FALLBACK",
                wasAutoRegistered: true
              });
            }
          }
          router.push("/dashboard");
        } else {
          setError("REGISTRATION_ERROR: Failed to establish sovereign credentials.");
          setLoading(false);
        }
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md relative z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1E2026]/95 backdrop-blur-2xl border border-[#2B2F36] p-8 shadow-[0_0_80px_rgba(240,185,11,0.1)] relative overflow-hidden group"
      >
        {/* Binance accents */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F0B90B] to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F0B90B] to-transparent opacity-50"></div>
        
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#F0B90B] opacity-50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#F0B90B] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#F0B90B] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#F0B90B] opacity-50"></div>

        <div className="flex flex-col items-center mb-8">
          <Terminal className="text-white w-12 h-12 mb-4 group-hover:text-[#F0B90B] transition-colors duration-700" />
          <h2 className="text-2xl font-black tracking-widest uppercase text-white">
            {mode === "LOGIN" ? "Login" : "Register"}
          </h2>
          <p className="text-[#F0B90B] font-mono mt-2 text-xs tracking-widest uppercase flex items-center gap-2 text-center">
            <span className="w-1.5 h-1.5 bg-[#F0B90B] rounded-full animate-pulse"></span>
            {mode === "LOGIN" ? "Enter credentials to access sovereign terminal" : "Create new credentials to initiate session"}
          </p>
        </div>

        <form onSubmit={handleAuthenticate} className="flex flex-col gap-6">
          <div className="relative group/input">
            <input 
              type="text" 
              required
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#F0B90B] transition-colors peer placeholder-transparent"
              placeholder="Username"
            />
            <label className="absolute left-0 top-3 text-zinc-600 font-mono text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#F0B90B] peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400">
              Username
            </label>
          </div>

          <div className="relative group/input">
            <input 
              type="password" 
              required
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#F0B90B] transition-colors peer placeholder-transparent tracking-widest"
              placeholder="Password"
            />
            <label className="absolute left-0 top-3 text-zinc-600 font-mono text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#F0B90B] peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-zinc-400">
              Access Key
            </label>
            <Fingerprint className="absolute right-0 top-3 w-4 h-4 text-zinc-600 peer-focus:text-[#F0B90B]" />
          </div>

          <AnimatePresence>
            {mode === "REGISTER" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative group/input overflow-hidden"
              >
                <input 
                  type="email" 
                  required={mode === "REGISTER"}
                  value={clearance}
                  onChange={(e) => setClearance(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#F0B90B] transition-colors peer placeholder-transparent tracking-widest mt-2"
                  placeholder="Email Address"
                />
                <label className="absolute left-0 top-5 text-zinc-600 font-mono text-xs tracking-widest pointer-events-none transition-all peer-focus:-top-2 peer-focus:text-[#F0B90B] peer-focus:text-[10px] peer-valid:-top-2 peer-valid:text-[10px] peer-valid:text-zinc-400">
                  Email Address
                </label>
                <ScanFace className="absolute right-0 top-5 w-4 h-4 text-zinc-600 peer-focus:text-[#F0B90B]" />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-500 font-mono text-xs tracking-widest uppercase flex items-center gap-2 mt-2"
            >
              <ShieldAlert className="w-4 h-4" />
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="mt-4 flex items-center justify-center gap-4 bg-[#F0B90B] text-black px-8 py-4 font-bold tracking-widest uppercase hover:bg-[#F8D33A] transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_30px_rgba(240,185,11,0.3)] w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-ping"></span>
                {mode === "LOGIN" ? "Authenticating..." : "Creating Account..."}
              </span>
            ) : (
              <>
                <span>{mode === "LOGIN" ? "INITIALIZE SESSION" : "CREATE SOVEREIGN KEY"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => {
              setMode(mode === "LOGIN" ? "REGISTER" : "LOGIN");
              setError(null);
            }}
            className="text-xs font-mono text-zinc-500 hover:text-white transition-colors tracking-widest uppercase border-b border-transparent hover:border-white pb-1"
          >
            {mode === "LOGIN" ? "No account? Register" : "Have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
