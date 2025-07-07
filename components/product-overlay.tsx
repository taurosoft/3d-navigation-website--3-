"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ShoppingCart, Star, Info } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductOverlayProps {
  product: Product
  onClose: () => void
}

export function ProductOverlay({ product, onClose }: ProductOverlayProps) {
  // Handle popup lifecycle
  useEffect(() => {
    // Exit pointer lock when popup opens
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }

    // Handle escape key to close popup
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    // Prevent default pointer lock behavior while popup is open
    const handleClick = (event: MouseEvent) => {
      // Allow normal clicking within the popup
      event.stopPropagation()
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("click", handleClick, true)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 cursor-default">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 hover:bg-red-100 hover:text-red-600 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          <CardTitle className="text-3xl font-bold text-gray-800 pr-12">{product.name}</CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-600">(4.8/5 stars)</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Stock</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner">
                <img
                  src={product.imageUrl || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" size="lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="hover:bg-gray-50 bg-transparent">
                  <Info className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">${product.price}</div>
                <div className="text-sm text-gray-500">Free shipping • 30-day returns</div>
              </div>

              <div className="prose prose-sm">
                <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-800">Key Features:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Product Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h5 className="font-medium text-gray-800">Product Information</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">SKU:</span>
                    <span className="ml-2 font-medium">{product.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Warranty:</span>
                    <span className="ml-2 font-medium">1 Year</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Shipping:</span>
                    <span className="ml-2 font-medium">2-3 Days</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Support:</span>
                    <span className="ml-2 font-medium">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Need help?</span> Contact our sales team for personalized assistance.
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Continue Shopping
                </Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Buy Now - ${product.price}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popup Instructions */}
      <div className="absolute top-4 right-4 bg-blue-600/90 text-white p-3 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span>
            Press <kbd className="bg-white/20 px-1 rounded">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  )
}
