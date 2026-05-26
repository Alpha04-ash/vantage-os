"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function NeuralBrain() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.rotation.x = t * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial 
        color="#ffffff" 
        speed={3} 
        distort={0.4} 
        radius={1}
        transparent 
        opacity={0.1}
        wireframe
      />
      <mesh scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} wireframe />
      </mesh>
    </mesh>
  );
}

export function Brain3D() {
  return (
    <div className="w-full h-full min-h-[150px] relative">
      <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={4} rotationIntensity={1} floatIntensity={1}>
          <NeuralBrain />
        </Float>
      </Canvas>
    </div>
  );
}
