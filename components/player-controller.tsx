"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Euler } from "three"
import { useProductStore } from "@/hooks/use-product-store"
import type { MovementState } from "@/hooks/use-movement"

interface PlayerControllerProps {
  movement: MovementState
}

export function PlayerController({ movement }: PlayerControllerProps) {
  const { camera } = useThree()
  const velocity = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const rotation = useRef(new Euler())
  const { selectedProduct } = useProductStore()

  // Mouse look
  const isMouseLocked = useRef(false)
  const mouseMovement = useRef({ x: 0, y: 0 })
  const wasPopupOpen = useRef(false)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Disable mouse look when popup is open
      if (!isMouseLocked.current || selectedProduct) return

      mouseMovement.current.x -= event.movementX * 0.002
      mouseMovement.current.y -= event.movementY * 0.002
      mouseMovement.current.y = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, mouseMovement.current.y))
    }

    const handleClick = async (event: MouseEvent) => {
      // Don't request pointer lock if popup is open or clicking on UI elements
      if (selectedProduct || (event.target as HTMLElement).closest(".pointer-events-auto")) {
        return
      }

      try {
        if (!document.pointerLockElement && document.hasFocus()) {
          await document.body.requestPointerLock()
        }
      } catch (error) {
        console.log("Pointer lock not available")
      }
    }

    const handlePointerLockChange = () => {
      isMouseLocked.current = document.pointerLockElement === document.body
      if (!isMouseLocked.current) {
        // Only reset mouse movement if we're not in a popup
        if (!selectedProduct) {
          mouseMovement.current.x = 0
          mouseMovement.current.y = 0
        }
      }
    }

    const handlePointerLockError = () => {
      isMouseLocked.current = false
      console.log("Pointer lock error occurred")
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("click", handleClick)
    document.addEventListener("pointerlockchange", handlePointerLockChange)
    document.addEventListener("pointerlockerror", handlePointerLockError)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("click", handleClick)
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
      document.removeEventListener("pointerlockerror", handlePointerLockError)
    }
  }, [selectedProduct])

  // Handle popup state changes
  useEffect(() => {
    if (selectedProduct && !wasPopupOpen.current) {
      // Popup just opened - exit pointer lock
      wasPopupOpen.current = true
      if (document.pointerLockElement) {
        document.exitPointerLock()
      }
    } else if (!selectedProduct && wasPopupOpen.current) {
      // Popup just closed - reset state and allow pointer lock again
      wasPopupOpen.current = false
      isMouseLocked.current = false

      // Small delay to ensure smooth transition
      setTimeout(() => {
        // Reset mouse movement to prevent camera jumping
        mouseMovement.current.x = 0
        mouseMovement.current.y = 0
      }, 100)
    }
  }, [selectedProduct])

  useFrame((state, delta) => {
    // Disable camera movement when popup is open
    if (selectedProduct) return

    // Update rotation
    rotation.current.y = mouseMovement.current.x + movement.rotation.y
    rotation.current.x = mouseMovement.current.y + movement.rotation.x
    camera.rotation.copy(rotation.current)

    // Calculate movement direction
    direction.current.set(0, 0, 0)
    if (movement.forward) direction.current.z -= 1
    if (movement.backward) direction.current.z += 1
    if (movement.left) direction.current.x -= 1
    if (movement.right) direction.current.x += 1

    if (direction.current.length() > 0) {
      direction.current.normalize()
    }

    direction.current.applyEuler(camera.rotation)
    direction.current.y = 0

    // Movement physics
    const acceleration = 15
    const friction = 8
    const maxSpeed = 6

    if (direction.current.length() > 0) {
      velocity.current.add(direction.current.multiplyScalar(acceleration * delta))
    } else {
      velocity.current.multiplyScalar(Math.max(0, 1 - friction * delta))
    }

    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed)
    }

    // Collision detection with showroom boundaries
    const newPosition = camera.position.clone().add(velocity.current.clone().multiplyScalar(delta))

    // Showroom boundaries
    const boundaries = {
      minX: -18,
      maxX: 18,
      minZ: -13,
      maxZ: 12,
    }

    if (newPosition.x < boundaries.minX || newPosition.x > boundaries.maxX) {
      velocity.current.x = 0
      newPosition.x = Math.max(boundaries.minX, Math.min(boundaries.maxX, newPosition.x))
    }

    if (newPosition.z < boundaries.minZ || newPosition.z > boundaries.maxZ) {
      velocity.current.z = 0
      newPosition.z = Math.max(boundaries.minZ, Math.min(boundaries.maxZ, newPosition.z))
    }

    // Collision with pedestals
    const pedestals = [
      { pos: [-10, 0, 5], radius: 1.5 },
      { pos: [10, 0, 5], radius: 1.5 },
    ]

    for (const pedestal of pedestals) {
      const distance = Math.sqrt(
        Math.pow(newPosition.x - pedestal.pos[0], 2) + Math.pow(newPosition.z - pedestal.pos[2], 2),
      )

      if (distance < pedestal.radius) {
        const pushX = (newPosition.x - pedestal.pos[0]) / distance
        const pushZ = (newPosition.z - pedestal.pos[2]) / distance

        newPosition.x = pedestal.pos[0] + pushX * pedestal.radius
        newPosition.z = pedestal.pos[2] + pushZ * pedestal.radius

        velocity.current.x *= -0.3
        velocity.current.z *= -0.3
      }
    }

    // Keep camera at eye level
    newPosition.y = 1.7

    camera.position.copy(newPosition)
  })

  return null
}
