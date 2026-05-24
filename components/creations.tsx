'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
}

export function Creations() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('id,name,category,price,image,featured,in_stock')
        .eq('featured', true)
        .eq('in_stock', true)
        .order('name')
        .limit(6)
      if (data) {
        setProducts(
          data.map((r: any) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            price: Number(r.price),
            image: r.image,
          })),
        )
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <section
      id="creations"
      className="w-full py-16 md:py-28 bg-linear-to-b from-secondary/30 to-background"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-14">
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground">
              Mes créations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Découvrez une collection faite avec soin, chaque pièce unique est réalisée avec amour
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={36} className="animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun produit mis en avant. Allez dans l'admin pour en sélectionner.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {products.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="flex">
                  <Card className="overflow-hidden bg-card hover:shadow-xl transition-all duration-300 border-border/50 group cursor-pointer flex flex-col w-full">
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

                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold text-foreground mb-3">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-4">{product.price}€</p>
                      <Button className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                        <Eye size={18} />
                        Voir le produit
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
