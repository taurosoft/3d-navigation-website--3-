"use client"

import { useState, useEffect } from "react"
import { useProductStore } from "@/hooks/use-product-store"

export interface MovementState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  rotation: { x: number; y: number }
  setForward: (value: boolean) => void
  setBackward: (value: boolean) => void
  setLeft: (value: boolean) => void
  setRight: (value: boolean) => void
  setLookUp: (value: boolean) => void
  setLookDown: (value: boolean) => void
  setLookLeft: (value: boolean) => void
  setLookRight: (value: boolean) => void
}

export function useMovement(): MovementState {
  const [forward, setForward] = useState(false)
  const [backward, setBackward] = useState(false)
  const [left, setLeft] = useState(false)
  const [right, setRight] = useState(false)
  const [lookUp, setLookUp] = useState(false)
  const [lookDown, setLookDown] = useState(false)
  const [lookLeft, setLookLeft] = useState(false)
  const [lookRight, setLookRight] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const { selectedProduct } = useProductStore()

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Disable movement when popup is open
      if (selectedProduct) return

      switch (event.code) {
        case "KeyW":
          setForward(true)
          break
        case "KeyS":
          setBackward(true)
          break
        case "KeyA":
          setLeft(true)
          break
        case "KeyD":
          setRight(true)
          break
        case "ArrowUp":
          setLookUp(true)
          event.preventDefault()
          break
        case "ArrowDown":
          setLookDown(true)
          event.preventDefault()
          break
        case "ArrowLeft":
          setLookLeft(true)
          event.preventDefault()
          break
        case "ArrowRight":
          setLookRight(true)
          event.preventDefault()
          break
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          setForward(false)
          break
        case "KeyS":
          setBackward(false)
          break
        case "KeyA":
          setLeft(false)
          break
        case "KeyD":
          setRight(false)
          break
        case "ArrowUp":
          setLookUp(false)
          break
        case "ArrowDown":
          setLookDown(false)
          break
        case "ArrowLeft":
          setLookLeft(false)
          break
        case "ArrowRight":
          setLookRight(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [selectedProduct])

  // Update rotation based on look controls
  useEffect(() => {
    const updateRotation = () => {
      // Disable rotation when popup is open
      if (selectedProduct) return

      setRotation((prev) => {
        let newX = prev.x
        let newY = prev.y

        const rotationSpeed = 0.05

        if (lookUp) newX += rotationSpeed
        if (lookDown) newX -= rotationSpeed
        if (lookLeft) newY += rotationSpeed
        if (lookRight) newY -= rotationSpeed

        // Clamp vertical rotation
        newX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newX))

        return { x: newX, y: newY }
      })
    }

    let animationFrame: number
    const animate = () => {
      updateRotation()
      animationFrame = requestAnimationFrame(animate)
    }

    if (lookUp || lookDown || lookLeft || lookRight) {
      animate()
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [lookUp, lookDown, lookLeft, lookRight, selectedProduct])

  return {
    forward,
    backward,
    left,
    right,
    rotation,
    setForward,
    setBackward,
    setLeft,
    setRight,
    setLookUp,
    setLookDown,
    setLookLeft,
    setLookRight,
  }
}
