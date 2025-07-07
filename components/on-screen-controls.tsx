"use client"

import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import type { MovementState } from "@/hooks/use-movement"

interface OnScreenControlsProps {
  movement: MovementState
}

export function OnScreenControls({ movement }: OnScreenControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
      {/* Movement Controls */}
      <div className="flex flex-col items-center space-y-2 pointer-events-auto">
        <div className="text-white text-sm font-medium mb-2 bg-black/50 px-2 py-1 rounded">Movement</div>

        {/* Forward */}
        <Button
          variant="outline"
          size="lg"
          className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
          onMouseDown={() => movement.setForward(true)}
          onMouseUp={() => movement.setForward(false)}
          onMouseLeave={() => movement.setForward(false)}
          onTouchStart={() => movement.setForward(true)}
          onTouchEnd={() => movement.setForward(false)}
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </Button>

        <div className="flex space-x-2">
          {/* Left */}
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
            onMouseDown={() => movement.setLeft(true)}
            onMouseUp={() => movement.setLeft(false)}
            onMouseLeave={() => movement.setLeft(false)}
            onTouchStart={() => movement.setLeft(true)}
            onTouchEnd={() => movement.setLeft(false)}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Button>

          {/* Backward */}
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
            onMouseDown={() => movement.setBackward(true)}
            onMouseUp={() => movement.setBackward(false)}
            onMouseLeave={() => movement.setBackward(false)}
            onTouchStart={() => movement.setBackward(true)}
            onTouchEnd={() => movement.setBackward(false)}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </Button>

          {/* Right */}
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
            onMouseDown={() => movement.setRight(true)}
            onMouseUp={() => movement.setRight(false)}
            onMouseLeave={() => movement.setRight(false)}
            onTouchStart={() => movement.setRight(true)}
            onTouchEnd={() => movement.setRight(false)}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Look Controls */}
      <div className="flex flex-col items-center space-y-2 pointer-events-auto">
        <div className="text-white text-sm font-medium mb-2 bg-black/50 px-2 py-1 rounded">Look</div>

        {/* Look Up */}
        <Button
          variant="outline"
          size="lg"
          className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
          onMouseDown={() => movement.setLookUp(true)}
          onMouseUp={() => movement.setLookUp(false)}
          onMouseLeave={() => movement.setLookUp(false)}
          onTouchStart={() => movement.setLookUp(true)}
          onTouchEnd={() => movement.setLookUp(false)}
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </Button>

        <div className="flex space-x-2">
          {/* Look Left */}
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
            onMouseDown={() => movement.setLookLeft(true)}
            onMouseUp={() => movement.setLookLeft(false)}
            onMouseLeave={() => movement.setLookLeft(false)}
            onTouchStart={() => movement.setLookLeft(true)}
            onTouchEnd={() => movement.setLookLeft(false)}
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </Button>

          {/* Look Down */}
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
            onMouseDown={() => movement.setLookDown(true)}
            onMouseUp={() => movement.setLookDown(false)}
            onMouseLeave={() => movement.setLookDown(false)}
            onTouchStart={() => movement.setLookDown(true)}
            onTouchEnd={() => movement.setLookDown(false)}
          >
            <ChevronDown className="w-6 h-6 text-white" />
          </Button>

          {/* Look Right */}
          <Button
            variant="outline"
            size="lg"
            className="w-12 h-12 bg-black/70 border-white/30 hover:bg-black/90"
            onMouseDown={() => movement.setLookRight(true)}
            onMouseUp={() => movement.setLookRight(false)}
            onMouseLeave={() => movement.setLookRight(false)}
            onTouchStart={() => movement.setLookRight(true)}
            onTouchEnd={() => movement.setLookRight(false)}
          >
            <RotateCcw className="w-6 h-6 text-white rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  )
}
