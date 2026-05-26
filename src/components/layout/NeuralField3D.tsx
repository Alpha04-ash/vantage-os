"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function DataStream({ count = 1000 }: { count: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function NeuralField3D() {
  // Reduce particle density on mobile for smooth 60fps
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 400 : 2000;
  const maxDpr = isMobile ? 1 : 1.5;

  return (
    <div className="fixed inset-0 -z-10 bg-[#0B0E11]">
      <Canvas dpr={[1, maxDpr]} performance={{ min: 0.5 }} camera={{ position: [0, 0, 5], fov: 60 }}>
        <DataStream count={particleCount} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/50 via-transparent to-[#0B0E11]" />
    </div>
  );
}
