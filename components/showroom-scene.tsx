"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Environment, ContactShadows } from "@react-three/drei"
import { ProductPanel } from "@/components/product-panel"
import { productData } from "@/data/products"
import type { Mesh } from "three"

export function ShowroomScene() {
  const floorRef = useRef<Mesh>(null)

  useFrame((state) => {
    // Subtle floor reflection animation
    if (floorRef.current) {
      floorRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <>
      {/* Environment and Lighting */}
      <Environment preset="studio" />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Additional showroom lighting for 3D models */}
      <spotLight position={[-10, 8, -10]} angle={Math.PI / 6} penumbra={0.5} intensity={1} castShadow />
      <spotLight position={[10, 8, -10]} angle={Math.PI / 6} penumbra={0.5} intensity={1} castShadow />
      <spotLight position={[0, 8, 5]} angle={Math.PI / 6} penumbra={0.5} intensity={0.8} castShadow />

      {/* Polished Showroom Floor */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#f8f9fa"
          metalness={0.2}
          roughness={0.05}
          transparent
          opacity={0.95}
          envMapIntensity={1}
        />
      </mesh>

      {/* Enhanced Contact Shadows for 3D models */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={40} blur={2} far={20} resolution={1024} />

      {/* Showroom Walls */}
      <ShowroomWalls />

      {/* 3D Product Displays */}
      <ProductDisplays />

      {/* Enhanced Decorative Elements */}
      <ShowroomDecor />
    </>
  )
}

function ShowroomWalls() {
  return (
    <group>
      {/* Back Wall with better lighting */}
      <mesh position={[0, 3, -15]} receiveShadow>
        <planeGeometry args={[40, 6]} />
        <meshStandardMaterial color="#f1f3f4" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-20, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#f1f3f4" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[20, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#f1f3f4" roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  )
}

function ProductDisplays() {
  return (
    <group>
      {productData.map((product, index) => (
        <ProductPanel key={product.id} product={product} position={getProductPosition(index)} />
      ))}
    </group>
  )
}

function ShowroomDecor() {
  return (
    <group>
      {/* Enhanced ceiling lights */}
      <mesh position={[-8, 5.5, -8]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[8, 5.5, -8]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, 5.5, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Premium display pedestals */}
      <mesh position={[-10, 0.5, 5]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
        <meshStandardMaterial color="#e9ecef" metalness={0.4} roughness={0.6} envMapIntensity={0.8} />
      </mesh>

      <mesh position={[10, 0.5, 5]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
        <meshStandardMaterial color="#e9ecef" metalness={0.4} roughness={0.6} envMapIntensity={0.8} />
      </mesh>

      {/* Showroom branding elements */}
      <mesh position={[0, 4, -14.8]} castShadow>
        <boxGeometry args={[8, 1, 0.1]} />
        <meshStandardMaterial
          color="#2c3e50"
          metalness={0.8}
          roughness={0.2}
          emissive="#34495e"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

function getProductPosition(index: number): [number, number, number] {
  const positions: [number, number, number][] = [
    [-12, 1.5, -14], // Back wall left - iPhone
    [-6, 1.5, -14], // Back wall center-left - MacBook
    [0, 1.5, -14], // Back wall center - AirPods
    [6, 1.5, -14], // Back wall center-right - iPad
    [12, 1.5, -14], // Back wall right - Apple Watch
    [-19, 1.5, -8], // Left wall - Mac Studio
    [-19, 1.5, 0], // Left wall center - Studio Display
    [-19, 1.5, 8], // Left wall front - Mac Pro
  ]

  return positions[index] || [0, 1.5, -14]
}
