"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useSpring } from "framer-motion";
import * as THREE from "three";

import { useRouter } from "next/navigation";
import { useVantageStore } from "@/store/useVantageStore";
import { Shield, ShieldAlert, Cpu, Activity, BarChart2 } from "lucide-react";

import {
  VoidScene,
  ChaosScene,
  AwakeningScene,
  IntelScene,
  MarketScene,
  EmpireScene,
  BankScene,
  AcademyScene,
  GatewayScene
} from "./scenes/Scenes";


export const CinematicExperience = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const totalScenes = 9;
  const maxIndex = totalScenes - 1;

  const { isAuthenticated } = useVantageStore();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Manual scroll progress driven by discrete scene indices
  const scrollProgress = useSpring(0, { damping: 40, stiffness: 50, mass: 1.5 });

  useEffect(() => {
    scrollProgress.set(currentScene / maxIndex);
  }, [currentScene, maxIndex, scrollProgress]);

  // Handle wheel events with debounce
  useEffect(() => {
    let isThrottled = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isThrottled) return;

      if (e.deltaY > 20) {
        setCurrentScene((prev) => {
          const next = Math.min(prev + 1, maxIndex);
          return next;
        });
        isThrottled = true;
        setTimeout(() => (isThrottled = false), 1200);
      } else if (e.deltaY < -20) {
        setCurrentScene((prev) => {
          const next = Math.max(prev - 1, 0);
          return next;
        });
        isThrottled = true;
        setTimeout(() => (isThrottled = false), 1200);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [maxIndex]);

  // Handle continuous hand drag and snapping on touch screens
  useEffect(() => {
    let touchStartY = 0;
    let baseProgress = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      baseProgress = scrollProgress.get();
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY - touchCurrentY;
      
      const pxPerScene = 250; 
      const progressDelta = (deltaY / pxPerScene) * (1 / maxIndex);
      
      const newProgress = Math.max(0, Math.min(1, baseProgress + progressDelta));
      scrollProgress.set(newProgress);
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const currentProgress = scrollProgress.get();
      const closestScene = Math.round(currentProgress * maxIndex);
      setCurrentScene(closestScene);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [maxIndex, scrollProgress, currentScene]);

  const handleDotClick = (index: number) => {
    setCurrentScene(index);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0B0E11] text-white selection:bg-[#F0B90B] selection:text-black font-sans overflow-hidden">
      
      {/* ================= PURE CSS HUD OVERLAYS (STUNNING AESTHETIC) ================= */}
      {/* Corner Brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#F0B90B]/30 pointer-events-none z-50" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#F0B90B]/30 pointer-events-none z-50" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#F0B90B]/30 pointer-events-none z-50" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#F0B90B]/30 pointer-events-none z-50" />

      {/* Cyber Grid Telemetries */}
      <div className="absolute left-10 top-10 z-50 hidden md:flex flex-col gap-1.5 font-mono text-[9px] text-[#848E9C]/60 pointer-events-none uppercase tracking-widest leading-none">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-[#F0B90B] animate-pulse" />
          <span>SYSTEM_ONLINE // VANTAGE_OS</span>
        </div>
        <span>SECTOR: 0x2A9F // RISK_LEVEL: LOW</span>
        <span>LATENCY_MATRIX: Hydrated (OK)</span>
      </div>

      <div className="absolute right-10 top-10 z-50 hidden md:flex flex-col items-end gap-1.5 font-mono text-[9px] text-[#848E9C]/60 pointer-events-none uppercase tracking-widest leading-none">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-[#F0B90B]" />
          <span>COGNITIVE_ARRAY: ACTIVE</span>
        </div>
        <span>SHIELD_INTEGRITY: 99.8%</span>
        <span>INDEXING: SECTOR_7_SCAN</span>
      </div>

      <div className="absolute left-10 bottom-10 z-50 hidden md:flex items-center gap-4 font-mono text-[8px] text-white/20 pointer-events-none uppercase tracking-widest">
        <span>© 2026 VANTAGE LABS</span>
        <span>//</span>
        <span>SECURE GATEWAY ENCRYPTED</span>
      </div>

      {/* Navigation Dots */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 pointer-events-auto">
        {Array.from({ length: totalScenes }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => handleDotClick(i)}
            className={`w-2 rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none ${currentScene === i ? 'h-8 bg-[#F0B90B] shadow-[0_0_20px_#F0B90B]' : 'h-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 0, 15], fov: 45 }}>
          <color attach="background" args={["#0B0E11"]} />
          <fog attach="fog" args={["#0B0E11", 5, 30]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#F0B90B" />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#F0B90B" />
          
          <Scene3DManager scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* HTML Overlay Scenes - All absolute positioned */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <VoidScene scrollProgress={scrollProgress} />
        <ChaosScene scrollProgress={scrollProgress} />
        <AwakeningScene scrollProgress={scrollProgress} />
        <IntelScene scrollProgress={scrollProgress} />
        <MarketScene scrollProgress={scrollProgress} />
        <EmpireScene scrollProgress={scrollProgress} />
        <BankScene scrollProgress={scrollProgress} />
        <AcademyScene scrollProgress={scrollProgress} />
        <GatewayScene scrollProgress={scrollProgress} />
      </div>
    </div>
  );
};

import { 
  VoidVortex,
  ChaosStructure, 
  AwakeningCore, 
  EmpireGrid, 
  SynapseNode, 
  AcademyRings, 
  TerminalPanels, 
  GatewayVault 
} from "./scenes/Structures3D";

// --- 3D Scene Manager ---
const Scene3DManager = ({ scrollProgress }: { scrollProgress: import("framer-motion").MotionValue<number> }) => {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesCount = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Spread particles along the diagonal path from (0,0,0) to (320,0,-320)
      pos[i * 3] = Math.random() * 340 - 10; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40; // y
      pos[i * 3 + 2] = -Math.random() * 340 + 10; // z
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    const offset = scrollProgress.get(); 
    particlesRef.current.rotation.y -= delta * 0.01;

    // Calculate position along the diagonal path (0 to 8)
    const currentSceneFloat = offset * 8;
    const targetX = currentSceneFloat * 40;
    const targetZ = -currentSceneFloat * 40;

    // Smoothly move camera
    state.camera.position.x = targetX;
    state.camera.position.z = targetZ + 15;
    
    // Add slight floating effect
    state.camera.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.4;

    state.camera.lookAt(targetX, 0, targetZ);
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={3000} factor={2} saturation={0} fade speed={1} />
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.06} 
          color="#F0B90B" 
          transparent 
          opacity={0.4} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3D Stations mapped to exact positions */}
      <VoidVortex position={[0, 0, 0]} />
      <ChaosStructure position={[40, 0, -40]} />
      <AwakeningCore position={[80, 0, -80]} />
      <TerminalPanels position={[120, 0, -120]} />
      <EmpireGrid position={[160, 0, -160]} />
      <AcademyRings position={[200, 0, -200]} />
      <GatewayVault position={[240, 0, -240]} />
      <SynapseNode position={[280, 0, -280]} />
      <GatewayVault position={[320, 0, -320]} />
    </group>
  );
};
