"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  PerspectiveCamera, 
  Environment, 
  ContactShadows,
  PresentationControls,
  Html
} from "@react-three/drei";
import * as THREE from "three";

function HolographicCrystal({ asset }: { asset: any }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
      groupRef.current.position.y = Math.sin(t) * 0.1;
    }
  });

  const imageUrl = asset?.image && asset.image !== "undefined" 
    ? asset.image 
    : "https://assets.coingecko.com/coins/images/1/small/bitcoin.png";

  return (
    <group ref={groupRef}>
      {/* THE COIN BODY */}
      <mesh castShadow>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={1} 
          roughness={0.1} 
          transparent 
          opacity={0.15} 
        />
      </mesh>

      {/* GLOWING EDGES */}
      <mesh>
        <cylinderGeometry args={[1.02, 1.02, 0.12, 64, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* FRONT LOGO (NATIVE HTML PROJECTION) */}
      <Html 
        transform 
        distanceFactor={2} 
        position={[0, 0, 0.06]} 
      >
        <div className="w-48 h-48 flex items-center justify-center p-4">
           <img 
             src={imageUrl} 
             alt={asset?.name} 
             className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
           />
        </div>
      </Html>

      {/* HOLOGRAPHIC LIGHT BEAMS */}
      <mesh position={[0, -1, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 0, 3, 32, 1, true]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.03} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* AMBIENT GLOW SPHERE */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function DataParticles({ count = 50 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          {...({ count: points.length / 3, array: points, itemSize: 3 } as any)} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.2} sizeAttenuation />
    </points>
  );
}

function DigitalRain({ count = 50 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = Math.random() * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i);
      y -= 0.1;
      if (y < -5) y = 5;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          {...({ count: points.length / 3, array: points, itemSize: 3 } as any)} 
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.1} />
    </points>
  );
}

export function Asset3D({ asset }: { asset: any }) {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      
      <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} shadows gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <PresentationControls
          global
          snap
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <HolographicCrystal key={asset?.id} asset={asset} />
          </Float>
        </PresentationControls>

        <DigitalRain count={100} />
        <DataParticles count={50} />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
      </Canvas>

      {/* OVERLAY TECH INFO */}
      <div className="absolute bottom-8 left-8 border-l border-white/20 pl-4 py-2 pointer-events-none">
        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">NODE_VISUALIZER_ACTIVE</div>
        <div className="text-[10px] font-mono text-white/40">RENDER_MODE: HOLOGRAPHIC_DEPTH</div>
      </div>
      
      <div className="absolute top-8 right-8 text-right pointer-events-none">
        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">SCAN_ID</div>
        <div className="text-[10px] font-mono text-white/40">{Math.random().toString(36).slice(2, 10).toUpperCase()}</div>
      </div>
    </div>
  );
}
