'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShoppingCart, ArrowLeft, Star, Heart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { products } from '@/lib/products-data'

// Legacy product data structure - merging with new data
const legacyProducts: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Amigurumi Ours',
    category: 'Amigurumis',
    price: 35,
    image: '/images/product-1.jpg',
    rating: 4.8,
    reviews: 24,
    inStock: true,
    description: 'Un adorable petit ours en crochet fait main avec amour. Parfait comme cadeau ou pour votre collection personnelle.',
    materials: 'Fil acrylique 100% (doux et hypoallergénique)',
    dimensions: 'Hauteur: 15cm',
    careInstructions: 'Lavage à la main avec eau tiède et savon doux',
    relatedProducts: ['5', '4'],
  },
  '2': {
    id: '2',
    name: 'Sac à Main Granny',
    category: 'Sacs en Granny',
    price: 55,
    image: '/images/product-2.jpg',
    rating: 4.9,
    reviews: 31,
    inStock: true,
    description: 'Sac élégant en carré granny aux couleurs douces. Un accessoire intemporel qui complète parfaitement votre style.',
    materials: 'Fil coton biologique et acrylique mélangé',
    dimensions: 'Largeur: 35cm, Hauteur: 30cm, Profondeur: 15cm',
    careInstructions: 'Lavage à la main recommandé. Laisser sécher à plat.',
    relatedProducts: ['3', '6'],
  },
  '3': {
    id: '3',
    name: 'Pochette Rose',
    category: 'Accessoires',
    price: 28,
    image: '/images/product-3.jpg',
    rating: 4.7,
    reviews: 18,
    inStock: true,
    description: 'Petite pochette rose pâle parfaite pour ranger vos essentiels. Délicate et pratique.',
    materials: 'Fil acrylique doux',
    dimensions: 'Largeur: 20cm, Hauteur: 15cm',
    careInstructions: 'Lavage à la main avec eau tiède',
    relatedProducts: ['1', '4'],
  },
  '4': {
    id: '4',
    name: 'Porte-clés Coloré',
    category: 'Petites créations',
    price: 15,
    image: '/images/product-4.jpg',
    rating: 4.6,
    reviews: 12,
    inStock: true,
    description: 'Petit porte-clés amigurumi coloré pour personnaliser votre quotidien.',
    materials: 'Fil acrylique',
    dimensions: 'Hauteur: 8cm',
    careInstructions: 'Nettoyage avec un chiffon sec',
    relatedProducts: ['1', '5'],
  },
  '5': {
    id: '5',
    name: 'Amigurumi Chat',
    category: 'Amigurumis',
    price: 40,
    image: '/images/product-5.jpg',
    rating: 4.9,
    reviews: 29,
    inStock: true,
    description: 'Un mignon petit chat en crochet avec des détails adorables.',
    materials: 'Fil acrylique premium',
    dimensions: 'Hauteur: 17cm',
    careInstructions: 'Lavage délicat à la main',
    relatedProducts: ['1', '6'],
  },
  '6': {
    id: '6',
    name: 'Sac d\'Enfant',
    category: 'Accessoires enfants',
    price: 32,
    image: '/images/product-6.jpg',
    rating: 4.8,
    reviews: 22,
    inStock: true,
    description: 'Petit sac parfait pour les enfants, fait avec des couleurs joyeuses.',
    materials: 'Fil acrylique',
    dimensions: 'Largeur: 25cm, Hauteur: 20cm',
    careInstructions: 'Lavage à la main',
    relatedProducts: ['2', '3'],
  },
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = products[id]
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const { addItem } = useCart()

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Produit non trouvé</h1>
            <Link href="/shop">
              <Button>Retourner à la boutique</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const relatedProducts = product.relatedProducts
    .map((id: string) => products[id])
    .filter(Boolean)

  const handleVariantChange = (variantType: string, optionValue: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: optionValue
    }))
  }

  const calculateFinalPrice = () => {
    let finalPrice = product.price
    if (product.variants) {
      product.variants.forEach(variant => {
        const selectedValue = selectedVariants[variant.label]
        const selectedOption = variant.options.find(opt => opt.value === selectedValue)
        if (selectedOption?.priceModifier) {
          finalPrice += selectedOption.priceModifier
        }
      })
    }
    return finalPrice
  }

  const handleAddToCart = () => {
    if (!product) return
    
    const variantLabel = product.variants && product.variants.length > 0 
      ? ' - ' + Object.entries(selectedVariants).map(([key, val]) => {
          const variant = product.variants?.find(v => v.label === key)
          const option = variant?.options.find(o => o.value === val)
          return `${key}: ${option?.name}`
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
        {/* Breadcrumb */}
        <div className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/shop" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft size={16} />
              Retour à la boutique
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Image */}
            <div className="relative h-[500px] rounded-xl overflow-hidden bg-muted/30 shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-primary font-semibold mb-2">{product.category}</p>
                    <h1 className="text-4xl font-serif font-bold text-foreground">{product.name}</h1>
                  </div>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <Heart
                      size={24}
                      className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}
                    />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} avis)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <p className="text-lg text-foreground leading-relaxed">{product.description}</p>

                {/* Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Matériaux</p>
                    <p className="text-sm text-muted-foreground">{product.materials}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dimensions</p>
                    <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Entretien</p>
                    <p className="text-sm text-muted-foreground">{product.careInstructions}</p>
                  </div>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  {product.variants.map((variant) => (
                    <div key={variant.label}>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        {variant.label}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {variant.options.map((option) => (
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

              {/* Price & Stock */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <p className="text-3xl font-bold text-primary">{calculateFinalPrice()}€</p>
                  <p className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'En stock' : 'Rupture de stock'}
                  </p>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-foreground">
                      Quantité:
                    </label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center border-0 bg-transparent text-foreground focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                      >
                        +
                      </button>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Produits similaires</h2>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((relProduct: any) => (
                  <Link key={relProduct.id} href={`/products/${relProduct.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
                      <div className="relative h-56 overflow-hidden bg-muted/30">
                        <Image
                          src={relProduct.image}
                          alt={relProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-xs text-primary font-semibold">{relProduct.category}</p>
                        <h3 className="font-semibold text-foreground">{relProduct.name}</h3>
                        <p className="text-xl font-bold text-primary">{relProduct.price}€</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section */}
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
                  <p className="text-muted-foreground">
                    Excellent produit, vraiment de qualité. Très satisfait de mon achat et je recommande vivement!
                  </p>
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
