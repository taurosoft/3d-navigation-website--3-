"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { ShowroomScene } from "@/components/showroom-scene"
import { PlayerController } from "@/components/player-controller"
import { OnScreenControls } from "@/components/on-screen-controls"
import { ProductOverlay } from "@/components/product-overlay"
import { CenterCrosshair } from "@/components/center-crosshair"
import { useMovement } from "@/hooks/use-movement"
import { useProductStore } from "@/hooks/use-product-store"

export default function ShowroomApp() {
  const movement = useMovement()
  const { selectedProduct, closeProduct } = useProductStore()

  return (
    <div className={`w-full h-screen relative bg-gray-900 ${selectedProduct ? "cursor-default" : "cursor-none"}`}>
      <Canvas
        camera={{
          position: [0, 1.7, 8],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <PlayerController movement={movement} />
          <ShowroomScene />
        </Suspense>
      </Canvas>

      <OnScreenControls movement={movement} />

      {/* Only show crosshair when popup is not open */}
      {!selectedProduct && <CenterCrosshair />}

      {selectedProduct && <ProductOverlay product={selectedProduct} onClose={closeProduct} />}

      {/* Showroom Instructions */}
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm backdrop-blur-sm">
        <h3 className="font-bold mb-2 text-lg">🛍️ Showroom Controls</h3>
        <div className="text-sm space-y-1">
          <p>
            <kbd className="bg-gray-600 px-1 rounded">W/A/S/D</kbd> - Move around
          </p>
          <p>
            <kbd className="bg-gray-600 px-1 rounded">Arrow Keys</kbd> - Look around
          </p>
          <p>
            <kbd className="bg-gray-600 px-1 rounded">Mouse</kbd> - Look around (click to enable)
          </p>
          <p>
            <span className="text-blue-300">Aim crosshair</span> at products
          </p>
          <p>
            <span className="text-green-300">Click</span> to view product details
          </p>
          {selectedProduct && <p className="text-yellow-300 mt-2">💡 Mouse cursor enabled for popup interaction</p>}
          {!selectedProduct && <p className="text-orange-300 mt-2">💡 Click anywhere to enable mouse look</p>}
        </div>
      </div>

      {/* Showroom Info */}
      <div className="absolute bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg backdrop-blur-sm">
        <p className="text-sm font-medium">🌟 Premium Tech Showroom</p>
        <p className="text-xs text-gray-300 mt-1">
          {selectedProduct ? "Interact with popup" : "Aim and click to interact"}
        </p>
      </div>
    </div>
  )
}
