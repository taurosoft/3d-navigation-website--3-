"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import type { Group } from "three"

interface Product3DModelProps {
  productId: string
  hovered: boolean
  clicked: boolean
}

export function Product3DModel({ productId, hovered, clicked }: Product3DModelProps) {
  const modelRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!modelRef.current) return

    // Auto-rotation when hovered
    if (hovered) {
      modelRef.current.rotation.y += delta * 0.5
    }

    // Click spin animation
    if (clicked) {
      modelRef.current.rotation.y += delta * 3
    }
  })

  const renderModel = () => {
    switch (productId) {
      case "iphone-15-pro":
        return <IPhoneModel ref={modelRef} hovered={hovered} />
      case "macbook-pro-16":
        return <MacBookModel ref={modelRef} hovered={hovered} />
      case "airpods-pro":
        return <AirPodsModel ref={modelRef} hovered={hovered} />
      case "ipad-pro":
        return <IPadModel ref={modelRef} hovered={hovered} />
      case "apple-watch-ultra":
        return <AppleWatchModel ref={modelRef} hovered={hovered} />
      case "mac-studio":
        return <MacStudioModel ref={modelRef} hovered={hovered} />
      case "studio-display":
        return <StudioDisplayModel ref={modelRef} hovered={hovered} />
      case "mac-pro":
        return <MacProModel ref={modelRef} hovered={hovered} />
      default:
        return <DefaultModel ref={modelRef} hovered={hovered} />
    }
  }

  return <>{renderModel()}</>
}

// iPhone 15 Pro Model
const IPhoneModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <group ref={groupRef}>
      {/* Phone Body */}
      <RoundedBox args={[0.4, 0.8, 0.05]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[0.35, 0.7, 0.01]} radius={0.03} smoothness={4} position={[0, 0, 0.03]} castShadow>
        <meshStandardMaterial color="#000" emissive="#1a1a2e" emissiveIntensity={hovered ? 0.3 : 0.1} />
      </RoundedBox>

      {/* Camera Module */}
      <group position={[-0.12, 0.25, 0.03]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.15, 0.02]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
        <mesh position={[-0.03, 0.03, 0.01]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.03, 0.03, 0.01]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, -0.03, 0.01]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    </group>
  )
}

// MacBook Pro Model
const MacBookModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)
  const screenRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current || !screenRef.current) return

    if (hovered) {
      groupRef.current.rotation.y += delta * 0.6
      // Animate screen opening
      const targetRotation = -Math.PI * 0.4
      screenRef.current.rotation.x += (targetRotation - screenRef.current.rotation.x) * delta * 3
    } else {
      // Close screen when not hovered
      screenRef.current.rotation.x += (0 - screenRef.current.rotation.x) * delta * 3
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Base */}
      <RoundedBox args={[1.2, 0.05, 0.8]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Keyboard area */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[1.1, 0.01, 0.7]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>

      {/* Screen */}
      <group ref={screenRef} position={[0, 0.025, -0.35]}>
        <RoundedBox args={[1.15, 0.75, 0.03]} radius={0.02} smoothness={4} castShadow>
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Screen display */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <boxGeometry args={[1.05, 0.65, 0.01]} />
          <meshStandardMaterial color="#000" emissive="#1a1a2e" emissiveIntensity={hovered ? 0.4 : 0.1} />
        </mesh>
      </group>
    </group>
  )
}

// AirPods Model
const AirPodsModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)
  const leftPodRef = useRef<Group>(null)
  const rightPodRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current || !leftPodRef.current || !rightPodRef.current) return

    if (hovered) {
      groupRef.current.rotation.y += delta * 0.7
      // Animate AirPods floating out of case
      leftPodRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2
      rightPodRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + Math.PI) * 0.1 + 0.2
    } else {
      leftPodRef.current.position.y += (0 - leftPodRef.current.position.y) * delta * 5
      rightPodRef.current.position.y += (0 - rightPodRef.current.position.y) * delta * 5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Case */}
      <RoundedBox args={[0.6, 0.25, 0.5]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color="#f8f8f8" metalness={0.1} roughness={0.1} />
      </RoundedBox>

      {/* Left AirPod */}
      <group ref={leftPodRef} position={[-0.15, 0, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.04, 0.15, 4, 8]} />
          <meshStandardMaterial color="#f8f8f8" />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.08, 4, 8]} />
          <meshStandardMaterial color="#f8f8f8" />
        </mesh>
      </group>

      {/* Right AirPod */}
      <group ref={rightPodRef} position={[0.15, 0, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.04, 0.15, 4, 8]} />
          <meshStandardMaterial color="#f8f8f8" />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <capsuleGeometry args={[0.03, 0.08, 4, 8]} />
          <meshStandardMaterial color="#f8f8f8" />
        </mesh>
      </group>
    </group>
  )
}

// iPad Model
const IPadModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.5
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* iPad Body */}
      <RoundedBox args={[0.8, 1.1, 0.06]} radius={0.03} smoothness={4} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[0.75, 1.05, 0.01]} radius={0.02} smoothness={4} position={[0, 0, 0.035]} castShadow>
        <meshStandardMaterial color="#000" emissive="#1a1a2e" emissiveIntensity={hovered ? 0.3 : 0.1} />
      </RoundedBox>

      {/* Camera */}
      <mesh position={[-0.3, 0.4, 0.035]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
    </group>
  )
}

// Apple Watch Model
const AppleWatchModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.8
    }
  })

  return (
    <group ref={groupRef}>
      {/* Watch Case */}
      <RoundedBox args={[0.35, 0.4, 0.08]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color="#2c2c2c" metalness={0.9} roughness={0.1} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[0.3, 0.35, 0.01]} radius={0.04} smoothness={4} position={[0, 0, 0.045]} castShadow>
        <meshStandardMaterial color="#000" emissive="#1a1a2e" emissiveIntensity={hovered ? 0.4 : 0.1} />
      </RoundedBox>

      {/* Digital Crown */}
      <mesh position={[0.18, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.03, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Watch Band */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#ff6b35" />
      </mesh>
      <mesh position={[0, -0.25, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#ff6b35" />
      </mesh>
    </group>
  )
}

// Mac Studio Model
const MacStudioModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.6
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <RoundedBox args={[0.8, 0.4, 0.8]} radius={0.03} smoothness={4} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Ventilation grilles */}
      <mesh position={[0, 0.21, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.01, 32]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>

      {/* Ports */}
      <mesh position={[0.41, -0.1, 0]} castShadow>
        <boxGeometry args={[0.01, 0.15, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

// Studio Display Model
const StudioDisplayModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Stand */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stand Arm */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Monitor */}
      <RoundedBox args={[1.2, 0.8, 0.05]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0, 0.03]} castShadow>
        <boxGeometry args={[1.15, 0.75, 0.01]} />
        <meshStandardMaterial color="#000" emissive="#1a1a2e" emissiveIntensity={hovered ? 0.3 : 0.1} />
      </mesh>
    </group>
  )
}

// Mac Pro Model
const MacProModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main Tower */}
      <RoundedBox args={[0.5, 1.2, 0.6]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Ventilation Pattern */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0.26, 0.4 - i * 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.01, 6]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
      ))}

      {/* Power Button */}
      <mesh position={[0, 0.61, 0.31]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

// Default Model
const DefaultModel = ({ hovered }: { hovered: boolean }) => {
  const groupRef = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (hovered) {
      groupRef.current.rotation.y += delta
    }
  })

  return (
    <group ref={groupRef}>
      <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color="#3498db" metalness={0.5} roughness={0.5} />
      </RoundedBox>
    </group>
  )
}
