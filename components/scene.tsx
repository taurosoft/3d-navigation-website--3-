"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"

export function Scene() {
  const cubeRef = useRef<Mesh>(null)
  const sphereRef = useRef<Mesh>(null)

  // Animate objects
  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01
      cubeRef.current.rotation.y += 0.01
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 + 2
    }
  })

  return (
    <>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#4ade80" />
      </mesh>

      {/* Grid pattern on ground */}
      <gridHelper args={[50, 50, "#22c55e", "#16a34a"]} position={[0, 0.01, 0]} />

      {/* Rotating Cube */}
      <mesh ref={cubeRef} position={[-3, 1, -2]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Floating Sphere */}
      <mesh ref={sphereRef} position={[3, 2, -2]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>

      {/* Static Cylinder */}
      <mesh position={[0, 1, -5]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>

      {/* Multiple cubes for collision testing */}
      <mesh position={[5, 0.5, 2]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>

      <mesh position={[-5, 0.5, 2]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>

      <mesh position={[0, 0.5, 8]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#06b6d4" />
      </mesh>

      {/* Walls for boundaries */}
      <mesh position={[25, 2, 0]} castShadow>
        <boxGeometry args={[1, 4, 50]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      <mesh position={[-25, 2, 0]} castShadow>
        <boxGeometry args={[1, 4, 50]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      <mesh position={[0, 2, 25]} castShadow>
        <boxGeometry args={[50, 4, 1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>

      <mesh position={[0, 2, -25]} castShadow>
        <boxGeometry args={[50, 4, 1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    </>
  )
}
