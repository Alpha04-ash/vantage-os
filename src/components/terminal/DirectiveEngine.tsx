"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  PerspectiveCamera, 
  Environment, 
  PresentationControls,
  Sparkles,
  Html
} from "@react-three/drei";
import * as THREE from "three";

function CoreProcessor({ color = "#ffffff", type = "DEFAULT" }: { color?: string, type?: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  const geometry = useMemo(() => {
    switch (type) {
      case "LIQUIDITY": return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case "RISK": return <octahedronGeometry args={[1.5, 0]} />;
      case "ALGO": return <icosahedronGeometry args={[1.4, 0]} />;
      case "SOVEREIGN": return <sphereGeometry args={[1.4, 32, 32]} />;
      default: return <boxGeometry args={[1.2, 1.2, 1.2]} />;
    }
  }, [type]);

  return (
    <group ref={groupRef}>
      {/* PRIMARY STRUCTURE */}
      <mesh>
        {geometry}
        <meshStandardMaterial 
          color={color} 
          metalness={1} 
          roughness={0.2} 
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* INNER CORE */}
      <mesh scale={0.8}>
        {geometry}
        <MeshDistortMaterial 
          color={color} 
          speed={2} 
          distort={0.3} 
          radius={1}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* ORBITAL DATA PLATES */}
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
          <mesh position={[2.5, 0, 0]}>
            <planeGeometry args={[0.8, 1.2]} />
            <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.DoubleSide} />
            <Html transform distanceFactor={3} position={[0, 0, 0.01]}>
               <div className="text-[6px] font-mono text-white/40 tracking-tighter">
                  ИД_ГИРЕҲ: {Math.random().toString(36).slice(2, 8).toUpperCase()}<br/>
                  ҲОЛАТ: ҲАМЗАМОНӢ...<br/>
                  БОРКУНӢ: {(Math.random() * 100).toFixed(2)}%
               </div>
            </Html>
          </mesh>
        </group>
      ))}

      {/* ROTATING RINGS */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.01, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[3.2, 0.005, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export function DirectiveEngine({ color = "#ffffff", type = "DEFAULT" }: { color?: string, type?: string }) {
  return (
    <div className="w-full h-full min-h-[400px] relative overflow-hidden bg-black">
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,#000_50%)] bg-[size:100%_4px]" />
      
      <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={color} />
        <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color={color} />
        
        <PresentationControls
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <CoreProcessor color={color} type={type} />
          </Float>
        </PresentationControls>
        
        <Sparkles count={100} scale={10} size={1} speed={0.2} color={color} opacity={0.1} />
        <Environment preset="night" />
      </Canvas>

      {/* INDUSTRIAL TERMINAL HUD */}
      <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between z-20">
         <div className="flex justify-between items-start">
            <div className="space-y-1">
               <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40">МАРКАЗИ_ДАСТУРҲО_v5.1</div>
               <div className="text-[12px] font-mono text-white/20">НАМУДИ_РАВАНД: {type}</div>
            </div>
            <div className="text-right">
               <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/40 mb-1">ТАЪХИР_ДАҚ</div>
               <div className="text-[12px] font-mono text-white/20">0.0004</div>
            </div>
         </div>
         
         <div className="flex justify-between items-center px-20">
            <div className="h-[1px] flex-1 bg-white/5" />
            <div className="px-10 text-[8px] font-mono text-white/10 tracking-[1em] uppercase">Системаҳои Саноатии Vantage</div>
            <div className="h-[1px] flex-1 bg-white/5" />
         </div>
      </div>
    </div>
  );
}
