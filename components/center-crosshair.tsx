"use client"

import { useState, useEffect } from "react"
import { useProductStore } from "@/hooks/use-product-store"

export function CenterCrosshair() {
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { hoveredProductName } = useProductStore()

  useEffect(() => {
    setIsHovering(!!hoveredProductName)
    setHoveredProduct(hoveredProductName)
  }, [hoveredProductName])

  return (
    <>
      {/* Center Crosshair */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="relative">
          {/* Main crosshair */}
          <div
            className={`w-6 h-6 border-2 rounded-full transition-all duration-200 ${
              isHovering
                ? "border-green-400 bg-green-400/20 scale-125 shadow-lg shadow-green-400/50"
                : "border-white/70 bg-white/10"
            }`}
          >
            {/* Center dot */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-all duration-200 ${
                isHovering ? "bg-green-400" : "bg-white/70"
              }`}
            />

            {/* Crosshair lines */}
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                isHovering ? "opacity-100" : "opacity-60"
              }`}
            >
              {/* Horizontal line */}
              <div
                className={`absolute w-8 h-0.5 -translate-x-1/2 -translate-y-1/2 ${
                  isHovering ? "bg-green-400" : "bg-white/70"
                }`}
              />
              {/* Vertical line */}
              <div
                className={`absolute h-8 w-0.5 -translate-x-1/2 -translate-y-1/2 ${
                  isHovering ? "bg-green-400" : "bg-white/70"
                }`}
              />
            </div>
          </div>

          {/* Interaction indicator */}
          {isHovering && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                <div className="text-green-400 text-xs mb-1">🎯 PRODUCT DETECTED</div>
                <div>{hoveredProduct}</div>
                <div className="text-xs text-gray-300 mt-1">Click to view details</div>
              </div>
              {/* Arrow pointing to crosshair */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/80" />
            </div>
          )}
        </div>
      </div>

      {/* Click indicator animation */}
      {isHovering && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-5">
          <div className="w-12 h-12 border-2 border-green-400/30 rounded-full animate-ping" />
        </div>
      )}
    </>
  )
}
