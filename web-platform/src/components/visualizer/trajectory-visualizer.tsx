'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

/**
 * TrajectoryVisualizer — 3D Ballistic Lunar Transfer (BLT) trajectory visualization.
 * Shows the spacecraft's low-energy transfer path from Earth to the Moon,
 * with the final polar orbit insertion.
 */

const EARTH_RADIUS = 1.5;
const MOON_RADIUS = 0.4;
const MOON_DISTANCE = 6;
const EARTH_POS: [number, number, number] = [0, 0, 0];
const MOON_POS: [number, number, number] = [MOON_DISTANCE, 0, 0];

function generateTrajectory(): [number, number, number][] {
  const points: [number, number, number][] = [];
  const numPoints = 200;
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const angle = t * Math.PI * 2.5;
    const radius = EARTH_RADIUS * 1.5 + t * (MOON_DISTANCE - EARTH_RADIUS * 1.5);
    const x = radius * Math.cos(angle) * (1 + t * 0.3);
    const y = radius * Math.sin(angle) * (1 + t * 0.3);
    const z = Math.sin(t * Math.PI * 3) * 0.5 * t;
    const blend = Math.max(0, (t - 0.85) / 0.15);
    points.push([
      x * (1 - blend) + MOON_POS[0] * blend,
      y * (1 - blend) + MOON_POS[1] * blend,
      z * (1 - blend) + MOON_POS[2] * blend,
    ]);
  }
  return points;
}

function generateLunarOrbit(): [number, number, number][] {
  const points: [number, number, number][] = [];
  const orbitRadius = MOON_RADIUS * 1.8;
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push([
      MOON_POS[0] + orbitRadius * Math.sin(angle),
      MOON_POS[1] + orbitRadius * Math.cos(angle) * 0.05,
      MOON_POS[2] + orbitRadius * Math.cos(angle),
    ]);
  }
  return points;
}

function Earth() {
  return (
    <group position={EARTH_POS}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshPhongMaterial color="#1e40af" emissive="#0c4a6e" emissiveIntensity={0.15} shininess={5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.08, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <Html position={[0, -EARTH_RADIUS - 0.5, 0]} center distanceFactor={8}>
        <div className="text-[10px] font-mono text-[#38bdf8] whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded">EARTH</div>
      </Html>
    </group>
  );
}

function Moon() {
  return (
    <group position={MOON_POS}>
      <mesh>
        <sphereGeometry args={[MOON_RADIUS, 48, 48]} />
        <meshPhongMaterial color="#94a3b8" emissive="#1e293b" emissiveIntensity={0.1} shininess={2} />
      </mesh>
      <Html position={[0, -MOON_RADIUS - 0.3, 0]} center distanceFactor={8}>
        <div className="text-[10px] font-mono text-slate-300 whitespace-nowrap bg-slate-950/80 px-1.5 py-0.5 rounded">MOON</div>
      </Html>
    </group>
  );
}

function Spacecraft({ trajectory }: { trajectory: [number, number, number][] }) {
  const meshRef = React.useRef<THREE.Group>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf: number;
    let lastTime = 0;
    const animate = (time: number) => {
      if (lastTime) {
        const delta = (time - lastTime) / 1000;
        setProgress((p) => (p + delta * 0.05) % 1);
      }
      lastTime = time;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const idx = Math.floor(progress * (trajectory.length - 1));
  const pos = trajectory[idx];

  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(pos[0], pos[1], pos[2]);
      if (idx < trajectory.length - 2) {
        const next = trajectory[idx + 1];
        meshRef.current.lookAt(next[0], next[1], next[2]);
      }
    }
  }, [pos, idx, trajectory]);

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.12, 0, 0]}>
        <boxGeometry args={[0.08, 0.002, 0.1]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.08, 0.002, 0.1]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
    </group>
  );
}

export function TrajectoryVisualizer() {
  const trajectory = React.useMemo(() => generateTrajectory(), []);
  const lunarOrbit = React.useMemo(() => generateLunarOrbit(), []);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-slate-950 flex items-center justify-center text-[#38bdf8] font-mono text-sm">
        Loading trajectory simulation...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      <Canvas camera={{ position: [3, 4, 8], fov: 50 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#fbbf24" />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#38bdf8" />
        <Earth />
        <Moon />
        <Line points={trajectory} color="#38bdf8" lineWidth={1.5} dashed dashSize={0.15} gapSize={0.1} transparent opacity={0.7} />
        <Line points={lunarOrbit} color="#34d399" lineWidth={1} transparent opacity={0.5} />
        <Spacecraft trajectory={trajectory} />
        <OrbitControls enablePan minDistance={4} maxDistance={20} />
      </Canvas>
      <div className="absolute top-3 left-3 space-y-1.5 pointer-events-none">
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 backdrop-blur">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#38bdf8] font-bold">Ballistic Lunar Transfer</p>
          <p className="text-[9px] font-mono text-slate-400">~3-4 months · Low-energy transfer</p>
        </div>
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 backdrop-blur">
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="inline-block w-3 h-0.5 bg-[#38bdf8]" /><span className="text-slate-300">Transfer trajectory</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono mt-0.5">
            <span className="inline-block w-3 h-0.5 bg-emerald-400" /><span className="text-slate-300">Lunar polar orbit (100km)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
