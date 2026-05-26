"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Box, Sphere, Torus, Cylinder, Plane, Icosahedron } from "@react-three/drei";

// 0. VOID VORTEX (Scene 0)
export const VoidVortex = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * 0.2;
      groupRef.current.children.forEach((ring, i) => {
        if (ring.type === "Mesh") return; // Skip the core
        ring.position.z += delta * 15;
        if (ring.position.z > 15) {
          ring.position.z = -100;
        }
      });
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.2;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Icosahedron ref={coreRef} args={[2, 0]} position={[0, 0, -20]}>
        <meshStandardMaterial color="#F0B90B" wireframe emissive="#F0B90B" emissiveIntensity={1.5} />
      </Icosahedron>
      
      {[...Array(40)].map((_, i) => (
        <Torus key={i} args={[5 + Math.sin(i * 0.2) * 3, 0.05, 16, 100]} position={[0, 0, -100 + i * 3]}>
          <meshStandardMaterial 
            color="#F0B90B" 
            emissive="#F0B90B" 
            emissiveIntensity={0.3 + (i / 40) * 0.7} 
            wireframe 
            transparent 
            opacity={0.3 + (i / 60)} 
          />
        </Torus>
      ))}
    </group>
  );
};

// 1. CHAOS STRUCTURE (Scene 1)
export const ChaosStructure = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create 50 random floating shards
  const shards = useMemo(() => {
    return Array.from({ length: 50 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
      scale: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 2 + 0.5,
    }));
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.1;
      
      // Make them twitch
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += delta * shards[i].speed;
        child.rotation.y += delta * shards[i].speed;
      });
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.position as any} scale={s.scale}>
          <boxGeometry args={[1, 0.1, 2]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#ff0055" : "#1A1D23"} emissive={i % 3 === 0 ? "#ff0055" : "#000000"} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
};

// 2. AWAKENING CORE (Scene 2)
export const AwakeningCore = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.z += delta * 0.2;
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Icosahedron ref={coreRef} args={[2, 1]}>
        <meshStandardMaterial color="#F0B90B" wireframe transparent opacity={0.3} emissive="#F0B90B" emissiveIntensity={0.5} />
      </Icosahedron>
      <Torus args={[3.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#F0B90B" emissive="#F0B90B" emissiveIntensity={1.5} />
      </Torus>
      <Torus args={[4.5, 0.02, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </Torus>
    </group>
  );
};

// 3. EMPIRE GRID (Scene 3)
export const EmpireGrid = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group position={position} ref={groupRef} rotation={[0.2, -0.4, 0]}>
      {/* Central pillar */}
      <Cylinder args={[1, 1, 10, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1E2026" metalness={1} roughness={0.1} />
      </Cylinder>
      {/* Data rings */}
      {[...Array(5)].map((_, i) => (
        <Torus key={i} args={[2 + i, 0.1, 4, 64]} rotation={[Math.PI / 2, 0, 0]} position={[0, -3 + i * 1.5, 0]}>
          <meshStandardMaterial color="#F0B90B" wireframe transparent opacity={0.5 - i * 0.05} />
        </Torus>
      ))}
      <gridHelper args={[20, 20, "#F0B90B", "#2B2F36"]} position={[0, -4, 0]} />
    </group>
  );
};

// 4. SYNAPSE NODE (Scene 4)
export const SynapseNode = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial color="#F0B90B" emissive="#F0B90B" emissiveIntensity={0.3} wireframe />
      </Sphere>
      <Sphere args={[1.8, 32, 32]}>
        <meshStandardMaterial color="#1A1D23" metalness={1} roughness={0} />
      </Sphere>
      {/* Neural connections */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 3, Math.sin(angle) * 3, 0]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.02, 0.02, 4]} />
            <meshStandardMaterial color="#F0B90B" emissive="#F0B90B" emissiveIntensity={1.5} />
          </mesh>
        );
      })}
    </group>
  );
};

// 5. ACADEMY RINGS (Scene 5)
export const AcademyRings = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += delta * (0.2 + i * 0.1);
        child.rotation.y -= delta * (0.1 + i * 0.05);
      });
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Torus args={[2, 0.05, 16, 100]}>
        <meshStandardMaterial color="#F0B90B" />
      </Torus>
      <Torus args={[3, 0.05, 16, 100]}>
        <meshStandardMaterial color="#F0B90B" wireframe />
      </Torus>
      <Torus args={[4, 0.02, 16, 100]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </Torus>
      <Sphere args={[0.5, 16, 16]}>
        <meshStandardMaterial color="#F0B90B" emissive="#F0B90B" emissiveIntensity={1.5} />
      </Sphere>
    </group>
  );
};

// 6. TERMINAL PANELS (Scene 6)
export const TerminalPanels = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={position} ref={groupRef} rotation={[0, -0.5, 0]}>
      <Plane args={[6, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1E2026" metalness={0.8} roughness={0.2} transparent opacity={0.8} side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[6, 3]} position={[0, 0, 0.01]}>
         <meshBasicMaterial color="#F0B90B" wireframe transparent opacity={0.2} />
      </Plane>
      {/* Side panels */}
      <Plane args={[3, 4]} position={[-4, 0, 1]} rotation={[0, 0.5, 0]}>
        <meshStandardMaterial color="#1E2026" metalness={0.8} roughness={0.2} transparent opacity={0.6} side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[3, 4]} position={[4, 0, 1]} rotation={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1E2026" metalness={0.8} roughness={0.2} transparent opacity={0.6} side={THREE.DoubleSide} />
      </Plane>
    </group>
  );
};

// 7. GATEWAY VAULT (Scene 7)
export const GatewayVault = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <Box args={[10, 20, 2]} position={[-8, 0, -5]}>
        <meshStandardMaterial color="#1A1D23" metalness={1} roughness={0.5} />
      </Box>
      <Box args={[10, 20, 2]} position={[8, 0, -5]}>
        <meshStandardMaterial color="#1A1D23" metalness={1} roughness={0.5} />
      </Box>
      <Cylinder args={[0.1, 0.1, 20]} position={[-3, 0, -4]}>
        <meshStandardMaterial color="#F0B90B" emissive="#F0B90B" emissiveIntensity={1.5} />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 20]} position={[3, 0, -4]}>
        <meshStandardMaterial color="#F0B90B" emissive="#F0B90B" emissiveIntensity={1.5} />
      </Cylinder>
    </group>
  );
};
