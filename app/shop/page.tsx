'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { supabase, dbToProduct } from '@/lib/supabase'
import { products as staticProducts } from '@/lib/products-data'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  inStock: boolean
}

const staticList: Product[] = Object.values(staticProducts).map(p => ({
  id: p.id, name: p.name, category: p.category,
  price: p.price, image: p.image,
  description: p.description, inStock: p.inStock,
}))

export default function Shop() {
  const [products, setProducts] = useState<Product[]>(staticList)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from('products').select('id,name,category,price,image,description,in_stock').eq('in_stock', true).order('name'),
        supabase.from('categories').select('name').order('position').order('id'),
      ])
      if (prods && prods.length > 0) {
        setProducts(prods.map(r => ({
          id: r.id, name: r.name, category: r.category,
          price: Number(r.price), image: r.image,
          description: r.description || '', inStock: r.in_stock,
        })))
      }
      if (cats && cats.length > 0) {
        setCategories(['Tous', ...cats.map((c: any) => c.name)])
      } else {
        setCategories(['Tous', 'Amigurumis', 'Sacs en Granny', 'Accessoires', 'Petites créations', 'Accessoires enfants'])
      }
      setLoading(false)
    }
    load()
  }, [])

  const filteredProducts = selectedCategory === 'Tous'
    ? products
    : products.filter(p => p.category === selectedCategory)

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      <section className="w-full py-16 md:py-24 bg-linear-to-b from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">Notre Boutique</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez toutes nos créations faites main avec amour
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-16 md:py-24 bg-background grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={36} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(product => (
                  <div key={product.id}>
                    <Link href={`/products/${product.id}`}>
                      <Card className="overflow-hidden bg-card hover:shadow-xl transition-all duration-300 group h-full cursor-pointer">
                        <div className="relative h-72 w-full overflow-hidden bg-muted/30">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                          <div className="absolute top-4 right-4 bg-accent/95 text-background px-3 py-1.5 rounded-full text-xs font-bold">
                            {product.category}
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                            <p className="text-2xl font-bold text-primary">{product.price}€</p>
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
                  <p className="text-lg text-muted-foreground">Aucun produit trouvé dans cette catégorie.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
