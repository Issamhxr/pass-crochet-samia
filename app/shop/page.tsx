'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
}

const allProducts: Product[] = [
  {
    id: '1',
    name: 'Amigurumi Ours',
    category: 'Amigurumis',
    price: 35,
    image: '/images/product-1.jpg',
    description: 'Adorable petit ours en crochet, parfait pour les enfants'
  },
  {
    id: '2',
    name: 'Sac à Main Granny',
    category: 'Sacs en Granny',
    price: 55,
    image: '/images/product-2.jpg',
    description: 'Sac élégant réalisé avec les carrés granny traditionnels'
  },
  {
    id: '3',
    name: 'Pochette Rose',
    category: 'Accessoires',
    price: 28,
    image: '/images/product-3.jpg',
    description: 'Pochette délicate en rose pâle, parfaite pour tous les usages'
  },
  {
    id: '4',
    name: 'Porte-clés Coloré',
    category: 'Petites créations',
    price: 15,
    image: '/images/product-4.jpg',
    description: 'Petit porte-clés amusant aux couleurs pastel'
  },
  {
    id: '5',
    name: 'Amigurumi Chat',
    category: 'Amigurumis',
    price: 40,
    image: '/images/product-5.jpg',
    description: 'Chat mignon en crochet, un compagnon parfait'
  },
  {
    id: '6',
    name: 'Sac d\'Enfant',
    category: 'Accessoires enfants',
    price: 32,
    image: '/images/product-6.jpg',
    description: 'Petit sac coloré adapté aux enfants, robuste et charmant'
  },
]

const categories = ['Tous', 'Amigurumis', 'Sacs en Granny', 'Accessoires', 'Petites créations', 'Accessoires enfants']

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const { addItem } = useCart()

  const filteredProducts = selectedCategory === 'Tous'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              Notre Boutique
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez toutes nos créations faites main avec amour
            </p>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="w-full py-16 md:py-24 bg-background flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-14">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card border-2 border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <div key={product.id}>
                <Link href={`/products/${product.id}`}>
                  <Card 
                    className="overflow-hidden bg-card hover:shadow-xl transition-all duration-300 group h-full cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-72 w-full overflow-hidden bg-muted/30">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-accent/95 text-background px-3 py-1.5 rounded-full text-xs font-bold">
                        {product.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {product.description}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {product.price}€
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Button 
                  onClick={() => addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                  })}
                  className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingCart size={18} />
                  Ajouter au panier
                </Button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Aucun produit trouvé dans cette catégorie.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
