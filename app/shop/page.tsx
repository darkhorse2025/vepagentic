"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Search, ShoppingCart, Star, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Product {
  id: string
  name: string
  image: string
  price: number
  rating: number
  category: string
  inStock: boolean
}

export default function ShopPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [cartCount, setCartCount] = useState(0)

  const products: Product[] = [
    {
      id: "1",
      name: "Magnetar Starter Kit",
      image: "/placeholder.svg?height=200&width=200",
      price: 2999,
      rating: 4.8,
      category: "Kits",
      inStock: true,
    },
    {
      id: "2",
      name: "Business Cards (100 pcs)",
      image: "/placeholder.svg?height=200&width=200",
      price: 499,
      rating: 4.5,
      category: "Marketing",
      inStock: true,
    },
    {
      id: "3",
      name: "Magnetar Branded Polo Shirt",
      image: "/placeholder.svg?height=200&width=200",
      price: 899,
      rating: 4.7,
      category: "Apparel",
      inStock: true,
    },
    {
      id: "4",
      name: "Product Catalog (2025 Edition)",
      image: "/placeholder.svg?height=200&width=200",
      price: 299,
      rating: 4.9,
      category: "Marketing",
      inStock: true,
    },
    {
      id: "5",
      name: "Presentation Tablet",
      image: "/placeholder.svg?height=200&width=200",
      price: 12999,
      rating: 4.6,
      category: "Electronics",
      inStock: false,
    },
    {
      id: "6",
      name: "Magnetar Tumbler",
      image: "/placeholder.svg?height=200&width=200",
      price: 599,
      rating: 4.4,
      category: "Merchandise",
      inStock: true,
    },
  ]

  const categories = ["All", "Kits", "Marketing", "Apparel", "Electronics", "Merchandise"]

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToCart = (productId: string) => {
    setCartCount((prev) => prev + 1)
    alert(`Added product to cart!`)
  }

  return (
    <div className="pb-16">
      <header className="app-header">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Magnetar Shop</h1>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </header>

      <div className="p-4 content-area">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 mb-4 gap-2 hide-scrollbar">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className="whitespace-nowrap cursor-pointer transition-all hover:scale-105"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                    onClick={() => alert("Added to favorites!")}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{formatCurrency(product.price)}</span>
                    <Button size="sm" disabled={!product.inStock} onClick={() => handleAddToCart(product.id)}>
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

