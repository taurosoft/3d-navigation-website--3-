"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { useProductStore } from "@/hooks/use-product-store"
import { Product3DModel } from "@/components/product-3d-models"
import type { Group } from "three"
import type { Product } from "@/types/product"

interface ProductPanelProps {
  product: Product
  position: [number, number, number]
}

export function ProductPanel({ product, position }: ProductPanelProps) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  const { camera, raycaster, pointer } = useThree()
  const { selectProduct, setHoveredProduct, clearHoveredProduct } = useProductStore()

  // Check if crosshair is pointing at this product
  useFrame(() => {
    if (!groupRef.current) return

    // Set raycaster from camera center (crosshair position)
    raycaster.setFromCamera({ x: 0, y: 0 }, camera)

    const intersects = raycaster.intersectObject(groupRef.current, true)
    const isPointingAt = intersects.length > 0

    if (isPointingAt && !hovered) {
      setHovered(true)
      setHoveredProduct(product.name)
    } else if (!isPointingAt && hovered) {
      setHovered(false)
      clearHoveredProduct()
    }
  })

  // Handle click detection
  useEffect(() => {
    const handleClick = () => {
      if (hovered) {
        setClicked(true)
        selectProduct(product)
        setTimeout(() => setClicked(false), 1000)
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [hovered, product, selectProduct])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Hover animation - lift and scale
    const targetY = hovered ? position[1] + 0.3 : position[1]
    const targetScale = hovered ? 1.15 : 1

    groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 8
    groupRef.current.scale.setScalar(groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * delta * 8)

    // Click animation
    if (clicked) {
      const pulseScale = 1.2 + Math.sin(state.clock.elapsedTime * 15) * 0.1
      groupRef.current.scale.setScalar(pulseScale)
    }

    // Subtle floating animation
    const floatOffset = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02
    groupRef.current.position.y = (hovered ? position[1] + 0.3 : position[1]) + floatOffset
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Display Platform */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial
          color={hovered ? "#3498db" : "#f8f9fa"}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={hovered ? 0.9 : 0.7}
          emissive={hovered ? "#2980b9" : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>

      {/* 3D Product Model */}
      <Product3DModel productId={product.id} hovered={hovered} clicked={clicked} />

      {/* Product Name */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.15}
        color={hovered ? "#2980b9" : "#2c3e50"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.ttf"
      >
        {product.name}
      </Text>

      {/* Product Price */}
      <Text
        position={[0, -1.7, 0]}
        fontSize={0.12}
        color="#27ae60"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.ttf"
      >
        ${product.price}
      </Text>

      {/* Enhanced hover glow effect */}
      {hovered && (
        <>
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.05, 32]} />
            <meshBasicMaterial color="#3498db" transparent opacity={0.3} />
          </mesh>

          {/* Pulsing ring effect */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[1.8, 1.8, 0.02, 32]} />
            <meshBasicMaterial color="#2ecc71" transparent opacity={0.4 + Math.sin(Date.now() * 0.005) * 0.2} />
          </mesh>
        </>
      )}

      {/* Interactive hint */}
      {hovered && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.08}
          color="#2ecc71"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.ttf"
        >
          🎯 CLICK TO VIEW DETAILS
        </Text>
      )}

      {/* Selection indicator */}
      {hovered && (
        <mesh position={[0, 0.5, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#2ecc71" transparent opacity={0.6} side={2} />
        </mesh>
      )}
    </group>
  )
}
