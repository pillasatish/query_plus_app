import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LegModel() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const veinSystemRef = useRef<THREE.Group>(null);
  const veinsRefs = useRef<THREE.Mesh[]>([]);

  // Create vein curve paths
  const createVeinCurve = (start: THREE.Vector3, control1: THREE.Vector3, control2: THREE.Vector3, end: THREE.Vector3) => {
    return new THREE.CubicBezierCurve3(start, control1, control2, end);
  };

  useEffect(() => {
    if (meshRef.current && veinSystemRef.current) {
      // Create custom materials
      const skinMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ffdbac',
        roughness: 0.5,
        metalness: 0.2,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        transparent: true,
        opacity: 0.9,
      });

      const veinMaterial = new THREE.MeshPhysicalMaterial({
        color: '#4a90e2',
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.6,
        emissive: '#4a90e2',
        emissiveIntensity: 0.2,
      });

      meshRef.current.material = skinMaterial;

      // Create complex vein system
      const veinPaths = [
        // Main saphenous vein
        createVeinCurve(
          new THREE.Vector3(0, -1.5, 0.5),
          new THREE.Vector3(0.3, -0.5, 0.6),
          new THREE.Vector3(0.2, 0.5, 0.7),
          new THREE.Vector3(0, 1.5, 0.5)
        ),
        // Branch 1
        createVeinCurve(
          new THREE.Vector3(0, 0, 0.5),
          new THREE.Vector3(0.5, 0.2, 0.6),
          new THREE.Vector3(0.7, 0.3, 0.5),
          new THREE.Vector3(0.8, 0.4, 0.4)
        ),
        // Branch 2
        createVeinCurve(
          new THREE.Vector3(0, -0.5, 0.5),
          new THREE.Vector3(-0.4, -0.3, 0.6),
          new THREE.Vector3(-0.6, -0.2, 0.5),
          new THREE.Vector3(-0.7, 0, 0.4)
        ),
        // Cross-connecting vein
        createVeinCurve(
          new THREE.Vector3(0.4, 0.2, 0.5),
          new THREE.Vector3(0.2, 0.3, 0.6),
          new THREE.Vector3(-0.2, 0.3, 0.6),
          new THREE.Vector3(-0.4, 0.2, 0.5)
        ),
      ];

      veinPaths.forEach((curve, index) => {
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.05 - index * 0.01, 8, false);
        const veinMesh = new THREE.Mesh(tubeGeometry, veinMaterial.clone());
        veinsRefs.current.push(veinMesh);
        veinSystemRef.current?.add(veinMesh);
      });

      // Add smaller tributary veins
      for (let i = 0; i < 8; i++) {
        const startPoint = new THREE.Vector3(
          Math.sin(i * Math.PI / 4) * 0.5,
          Math.cos(i * Math.PI / 4) * 0.5,
          0.5
        );
        const tributaryCurve = createVeinCurve(
          startPoint,
          startPoint.clone().add(new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, 0.1)),
          startPoint.clone().add(new THREE.Vector3(Math.random() * 0.3, Math.random() * 0.3, 0.1)),
          startPoint.clone().add(new THREE.Vector3(Math.random() * 0.4, Math.random() * 0.4, 0))
        );
        const tributaryGeometry = new THREE.TubeGeometry(tributaryCurve, 32, 0.02, 8, false);
        const tributaryMesh = new THREE.Mesh(tributaryGeometry, veinMaterial.clone());
        veinsRefs.current.push(tributaryMesh);
        veinSystemRef.current?.add(tributaryMesh);
      }
    }
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
      
      // Animate each vein independently
      veinsRefs.current.forEach((vein, index) => {
        const material = vein.material as THREE.MeshPhysicalMaterial;
        const timeOffset = index * 0.2;
        material.opacity = 0.4 + Math.sin(state.clock.getElapsedTime() * 2 + timeOffset) * 0.2;
        material.emissiveIntensity = 0.2 + Math.sin(state.clock.getElapsedTime() * 2 + timeOffset) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main leg geometry */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 0.8, 4, 32]} />
      </mesh>

      {/* Vein system container */}
      <group ref={veinSystemRef} />
    </group>
  );
}