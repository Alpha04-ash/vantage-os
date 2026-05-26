"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

function RotatingGlobe() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.1} 
        />
      </mesh>
      <mesh scale={0.95}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>
      
      {/* ATMOSPHERE GLOW */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export function Globe3D() {
  return (
    <div className="w-full h-full min-h-[300px] relative">
      <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <RotatingGlobe />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
