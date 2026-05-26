"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CoreGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = t * 0.1;
  });

  return (
    <group>
      {/* CENTRAL CORE */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial 
          color="#ffffff" 
          wireframe 
          transparent 
          opacity={0.1} 
        />
      </mesh>
      
      {/* FLOATING INNER CUBE */}
      <Float speed={5} rotationIntensity={2} floatIntensity={1}>
        <mesh scale={0.5}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      </Float>

      {/* OUTER SCANNING RINGS */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export function SystemCore3D() {
  return (
    <div className="w-full h-full min-h-[300px] relative">
      <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <PresentationControls
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <CoreGeometry />
        </PresentationControls>
        
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
