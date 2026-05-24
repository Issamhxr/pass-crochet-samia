'use client'

import { useState, use, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShoppingCart, ArrowLeft, Star, Heart, Check, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { supabase, dbToProduct } from '@/lib/supabase'

type Product = ReturnType<typeof dbToProduct>

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        const p = dbToProduct(data)
        setProduct(p)
        if (p.relatedProducts?.length) {
          const { data: relData } = await supabase.from('products').select('*').in('id', p.relatedProducts)
          if (relData) setRelated(relData.map(dbToProduct))
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 size={36} className="animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Produit non trouvé</h1>
            <Link href="/shop"><Button>Retourner à la boutique</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleVariantChange = (label: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [label]: value }))
  }

  const calculateFinalPrice = () => {
    let price = product.price
    product.variants?.forEach(variant => {
      const opt = variant.options.find((o: any) => o.value === selectedVariants[variant.label])
      if (opt?.priceModifier) price += opt.priceModifier
    })
    return price
  }

  const handleAddToCart = () => {
    const variantLabel = product.variants?.length
      ? ' - ' + Object.entries(selectedVariants).map(([key, val]) => {
          const variant = product.variants?.find((v: any) => v.label === key)
          const opt = variant?.options.find((o: any) => o.value === val)
          return `${key}: ${opt?.name}`
        }).join(', ')
      : ''
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${Date.now()}-${i}`,
        name: product.name + variantLabel,
        price: calculateFinalPrice(),
        image: product.image,
        category: product.category,
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/shop" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft size={16} />
              Retour à la boutique
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="relative h-125 rounded-xl overflow-hidden bg-muted/30 shadow-lg">
              <Image src={product.image} alt={product.name} fill className="object-cover" priority unoptimized />
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-primary font-semibold mb-2">{product.category}</p>
                    <h1 className="text-4xl font-serif font-bold text-foreground">{product.name}</h1>
                  </div>
                  <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <Heart size={24} className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} avis)</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-foreground leading-relaxed">{product.description}</p>
                <div className="space-y-3">
                  {product.materials && (
                    <div>
                      <p className="text-sm font-semibold text-foreground">Matériaux</p>
                      <p className="text-sm text-muted-foreground">{product.materials}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <p className="text-sm font-semibold text-foreground">Dimensions</p>
                      <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                    </div>
                  )}
                  {product.careInstructions && (
                    <div>
                      <p className="text-sm font-semibold text-foreground">Entretien</p>
                      <p className="text-sm text-muted-foreground">{product.careInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {product.variants.map((variant: any) => (
                    <div key={variant.label}>
                      <label className="text-sm font-semibold text-foreground mb-2 block">{variant.label}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {variant.options.map((option: any) => (
                          <button
                            key={option.value}
                            onClick={() => handleVariantChange(variant.label, option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                              selectedVariants[variant.label] === option.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-background text-foreground hover:border-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2 justify-center">
                              {selectedVariants[variant.label] === option.value && <Check size={16} />}
                              <span>{option.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <p className="text-3xl font-bold text-primary">{calculateFinalPrice()}€</p>
                  <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'En stock' : 'Rupture de stock'}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-foreground">Quantité:</label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-foreground hover:bg-secondary transition-colors">-</button>
                      <input
                        type="number" min="1" value={quantity}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center border-0 bg-transparent text-foreground focus:outline-none"
                      />
                      <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-foreground hover:bg-secondary transition-colors">+</button>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <ShoppingCart size={20} />
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="border-t border-border py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Produits similaires</h2>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {related.map(rel => (
                  <Link key={rel.id} href={`/products/${rel.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                      <div className="relative h-56 overflow-hidden bg-muted/30">
                        <Image src={rel.image} alt={rel.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-xs text-primary font-semibold">{rel.category}</p>
                        <h3 className="font-semibold text-foreground">{rel.name}</h3>
                        <p className="text-xl font-bold text-primary">{rel.price}€</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border py-12 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Avis clients</h2>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">Client satisfait</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} className="fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                  </div>
                  <p className="text-muted-foreground">Excellent produit, vraiment de qualité. Très satisfait de mon achat et je recommande vivement!</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
