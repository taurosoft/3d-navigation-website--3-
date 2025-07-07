"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Euler } from "three"
import type { MovementState } from "@/hooks/use-movement"

interface CameraControllerProps {
  movement: MovementState
}

export function CameraController({ movement }: CameraControllerProps) {
  const { camera } = useThree()
  const velocity = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const rotation = useRef(new Euler())

  // Mouse look
  const isMouseLocked = useRef(false)
  const mouseMovement = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseLocked.current) return

      mouseMovement.current.x -= event.movementX * 0.002
      mouseMovement.current.y -= event.movementY * 0.002
      mouseMovement.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, mouseMovement.current.y))
    }

    const handleClick = async () => {
      try {
        // Only request pointer lock if not already locked and if the document is focused
        if (!document.pointerLockElement && document.hasFocus()) {
          await document.body.requestPointerLock()
        }
      } catch (error) {
        // Silently handle pointer lock errors - they're not critical for functionality
        console.log("Pointer lock not available or denied")
      }
    }

    const handlePointerLockChange = () => {
      isMouseLocked.current = document.pointerLockElement === document.body

      // Reset mouse movement when exiting pointer lock
      if (!isMouseLocked.current) {
        mouseMovement.current.x = 0
        mouseMovement.current.y = 0
      }
    }

    const handlePointerLockError = () => {
      // Handle pointer lock errors gracefully
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
  }, [])

  useFrame((state, delta) => {
    // Update rotation from mouse and arrow keys
    rotation.current.y = mouseMovement.current.x + movement.rotation.y
    rotation.current.x = mouseMovement.current.y + movement.rotation.x

    // Apply rotation to camera
    camera.rotation.copy(rotation.current)

    // Calculate movement direction based on camera rotation
    direction.current.set(0, 0, 0)

    if (movement.forward) direction.current.z -= 1
    if (movement.backward) direction.current.z += 1
    if (movement.left) direction.current.x -= 1
    if (movement.right) direction.current.x += 1

    // Normalize direction
    if (direction.current.length() > 0) {
      direction.current.normalize()
    }

    // Apply camera rotation to movement direction
    direction.current.applyEuler(camera.rotation)
    direction.current.y = 0 // Keep movement horizontal

    // Smooth acceleration/deceleration
    const acceleration = 20
    const friction = 10
    const maxSpeed = 8

    if (direction.current.length() > 0) {
      velocity.current.add(direction.current.multiplyScalar(acceleration * delta))
    } else {
      velocity.current.multiplyScalar(Math.max(0, 1 - friction * delta))
    }

    // Limit max speed
    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed)
    }

    // Basic collision detection with boundaries
    const newPosition = camera.position.clone().add(velocity.current.clone().multiplyScalar(delta))

    // Check boundaries
    const boundary = 24
    if (Math.abs(newPosition.x) > boundary) {
      velocity.current.x = 0
      newPosition.x = Math.sign(newPosition.x) * boundary
    }
    if (Math.abs(newPosition.z) > boundary) {
      velocity.current.z = 0
      newPosition.z = Math.sign(newPosition.z) * boundary
    }

    // Simple collision detection with objects
    const objects = [
      { pos: [-3, 0, -2], size: 1 },
      { pos: [3, 0, -2], size: 1.6 },
      { pos: [0, 0, -5], size: 1 },
      { pos: [5, 0, 2], size: 1 },
      { pos: [-5, 0, 2], size: 1 },
      { pos: [0, 0, 8], size: 1 },
    ]

    for (const obj of objects) {
      const distance = Math.sqrt(Math.pow(newPosition.x - obj.pos[0], 2) + Math.pow(newPosition.z - obj.pos[2], 2))

      if (distance < obj.size + 0.5) {
        // Push away from object
        const pushX = (newPosition.x - obj.pos[0]) / distance
        const pushZ = (newPosition.z - obj.pos[2]) / distance

        newPosition.x = obj.pos[0] + pushX * (obj.size + 0.5)
        newPosition.z = obj.pos[2] + pushZ * (obj.size + 0.5)

        velocity.current.x *= -0.5
        velocity.current.z *= -0.5
      }
    }

    // Keep camera at eye level
    newPosition.y = 2

    // Apply movement
    camera.position.copy(newPosition)
  })

  return null
}
