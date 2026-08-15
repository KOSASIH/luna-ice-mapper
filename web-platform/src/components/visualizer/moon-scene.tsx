'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import {
  DataLayerType,
  DataPoint,
  PSR_REGIONS,
  latLonToVector3,
  vector3ToLatLon,
  getPointData,
  getColormapRGB
} from '@/lib/psr-data';

interface MoonSceneProps {
  activeLayer: DataLayerType;
  timeValue: number; // 0 - 360
  overlayOpacity: number; // 0 - 1
  showPSROverlays: boolean;
  showCraterLabels: boolean;
  onPointSelect: (point: DataPoint) => void;
  selectedCraterId: string | null;
  cameraView: 'south-pole' | 'equator' | 'orbit';
}

function CameraController({ cameraView }: { cameraView: 'south-pole' | 'equator' | 'orbit' }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5.2));
  const lookAtPos = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    switch (cameraView) {
      case 'south-pole':
        targetPos.current.set(0.01, -5.2, 0.01);
        lookAtPos.current.set(0, -2.0, 0);
        break;
      case 'equator':
        targetPos.current.set(0, 0, 5.2);
        lookAtPos.current.set(0, 0, 0);
        break;
      case 'orbit':
        targetPos.current.set(3.8, 2.5, 4.2);
        lookAtPos.current.set(0, 0, 0);
        break;
    }
  }, [cameraView]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(lookAtPos.current);
  });

  return null;
}

export function MoonScene({
  activeLayer,
  timeValue,
  overlayOpacity,
  showPSROverlays,
  showCraterLabels,
  onPointSelect,
  selectedCraterId,
  cameraView
}: MoonSceneProps) {
  const moonRef = useRef<THREE.Mesh>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const orbitControlsRef = useRef<any>(null);

  useFrame((state, delta) => {
    const sunAngle = (timeValue * Math.PI) / 180;
    const sunDistance = 25;
    if (sunLightRef.current) {
      sunLightRef.current.position.set(
        Math.sin(sunAngle) * sunDistance,
        1.8,
        Math.cos(sunAngle) * sunDistance
      );
    }

    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.015;
    }
  });

  const textures = useMemo(() => {
    if (typeof document === 'undefined') return { map: null, bumpMap: null };

    const width = 2048;
    const height = 1024;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = width;
    bumpCanvas.height = height;
    const bumpCtx = bumpCanvas.getContext('2d');

    if (!ctx || !bumpCtx) return { map: null, bumpMap: null };

    const imgData = ctx.createImageData(width, height);
    const bumpData = bumpCtx.createImageData(width, height);

    const data = imgData.data;
    const bump = bumpData.data;

    let minVal = 0;
    let maxVal = 100;
    let cmapName = 'viridis';

    switch (activeLayer) {
      case 'ice':
        minVal = 0;
        maxVal = 100;
        cmapName = 'blues';
        break;
      case 'neutron':
        minVal = 100;
        maxVal = 220;
        cmapName = 'plasma';
        break;
      case 'temperature':
        minVal = 30;
        maxVal = 150;
        cmapName = 'plasma';
        break;
      case 'slope':
        minVal = 0;
        maxVal = 45;
        cmapName = 'viridis';
        break;
      case 'illumination':
        minVal = 0;
        maxVal = 100;
        cmapName = 'plasma';
        break;
    }

    for (let y = 0; y < height; y++) {
      const v = y / height;
      const lat = 90 - v * 180;

      for (let x = 0; x < width; x++) {
        const u = x / width;
        const lon = u * 360 - 180;

        const idx = (y * width + x) * 4;

        const n1 = Math.sin(lat * 0.15) * Math.cos(lon * 0.12);
        const n2 = Math.sin(lat * 0.8 + lon * 0.6) * 0.25;
        const n3 = Math.cos(lat * 2.5) * Math.sin(lon * 2.5) * 0.12;
        const baseNoise = (n1 + n2 + n3 + 1.3) / 2.6;

        const isMaria = Math.abs(lat) < 40 && baseNoise < 0.45;
        let baseR = isMaria ? 58 : 135;
        let baseG = isMaria ? 60 : 138;
        let baseB = isMaria ? 65 : 142;

        const shade = 0.7 + baseNoise * 0.5;
        baseR = Math.min(255, baseR * shade);
        baseG = Math.min(255, baseG * shade);
        baseB = Math.min(255, baseB * shade);

        let finalR = baseR;
        let finalG = baseG;
        let finalB = baseB;

        if (lat <= -68) {
          const ptData = getPointData(lat, lon);
          let layerValue = 0;

          switch (activeLayer) {
            case 'ice':
              layerValue = ptData.iceProbability;
              break;
            case 'neutron':
              layerValue = ptData.neutronCount;
              break;
            case 'temperature':
              layerValue = ptData.temperature;
              break;
            case 'slope':
              layerValue = ptData.slope;
              break;
            case 'illumination':
              layerValue = ptData.illumination;
              break;
          }

          const [ovR, ovG, ovB] = getColormapRGB(layerValue, minVal, maxVal, cmapName);

          const edgeFade = Math.min(1.0, Math.max(0, (-68 - lat) / 4.0));
          const blendAlpha = overlayOpacity * edgeFade;

          finalR = baseR * (1 - blendAlpha) + ovR * blendAlpha;
          finalG = baseG * (1 - blendAlpha) + ovG * blendAlpha;
          finalB = baseB * (1 - blendAlpha) + ovB * blendAlpha;
        }

        data[idx] = Math.round(finalR);
        data[idx + 1] = Math.round(finalG);
        data[idx + 2] = Math.round(finalB);
        data[idx + 3] = 255;

        const bumpVal = Math.round(Math.max(0, Math.min(255, baseNoise * 220 + 20)));
        bump[idx] = bumpVal;
        bump[idx + 1] = bumpVal;
        bump[idx + 2] = bumpVal;
        bump[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    bumpCtx.putImageData(bumpData, 0, 0);

    const mapTex = new THREE.CanvasTexture(canvas);
    mapTex.needsUpdate = true;

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.needsUpdate = true;

    return { map: mapTex, bumpMap: bumpTex };
  }, [activeLayer, overlayOpacity]);

  const handleMoonClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!e.point) return;
      const pointOnSphere = e.point;
      const { lat, lon } = vector3ToLatLon(pointOnSphere.x, pointOnSphere.y, pointOnSphere.z, 2.0);
      const dataPoint = getPointData(lat, lon);
      onPointSelect(dataPoint);
    },
    [onPointSelect]
  );

  return (
    <>
      <color attach="background" args={['#030712']} />
      <Stars radius={120} depth={60} count={7000} factor={4} saturation={0} fade speed={0.8} />

      <ambientLight intensity={0.06} />
      <directionalLight
        ref={sunLightRef}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        color="#fffbeb"
      />

      <CameraController cameraView={cameraView} />

      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.8}
        rotateSpeed={0.6}
        minDistance={2.4}
        maxDistance={12.0}
      />

      <group>
        <mesh
          ref={moonRef}
          onClick={handleMoonClick}
          receiveShadow
          castShadow
        >
          <sphereGeometry args={[2.0, 128, 128]} />
          <meshStandardMaterial
            map={textures.map || undefined}
            bumpMap={textures.bumpMap || undefined}
            bumpScale={0.06}
            roughness={0.92}
            metalness={0.05}
          />
        </mesh>

        {showPSROverlays &&
          PSR_REGIONS.map((crater) => {
            const pos = latLonToVector3(crater.lat, crater.lon, 2.015);
            const isSelected = selectedCraterId === crater.id;

            return (
              <group key={crater.id} position={[pos.x, pos.y, pos.z]}>
                <mesh
                  onClick={(e) => {
                    e.stopPropagation();
                    onPointSelect(getPointData(crater.lat, crater.lon));
                  }}
                >
                  <sphereGeometry args={[isSelected ? 0.035 : 0.02, 16, 16]} />
                  <meshBasicMaterial color={isSelected ? '#38bdf8' : '#0284c7'} />
                </mesh>

                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.028, 0.038, 32]} />
                  <meshBasicMaterial
                    color={isSelected ? '#38bdf8' : '#38bdf8'}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={isSelected ? 0.9 : 0.6}
                  />
                </mesh>

                {showCraterLabels && (
                  <Html
                    position={[0, 0.05, 0]}
                    center
                    distanceFactor={8}
                    zIndexRange={[100, 0]}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPointSelect(getPointData(crater.lat, crater.lon));
                      }}
                      className={`group flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/50 scale-110 border border-sky-300'
                          : 'bg-slate-950/80 hover:bg-slate-900 text-sky-400 border border-sky-500/30 backdrop-blur-md'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      <span>{crater.name}</span>
                      <span className="text-[9px] opacity-75">({crater.iceConcentration} wt%)</span>
                    </button>
                  </Html>
                )}
              </group>
            );
          })}
      </group>
    </>
  );
}
