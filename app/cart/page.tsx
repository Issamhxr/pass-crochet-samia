'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Trash2, ArrowLeft, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Package size={64} className="text-muted-foreground/30" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Panier vide</h1>
            <p className="text-muted-foreground max-w-sm">
              Vous n&apos;avez pas d&apos;articles dans votre panier. Continuez vos achats!
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
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
              Continuer vos achats
            </Link>
          </div>
        </div>

        {/* Cart Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Mon panier</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <Link href={`/products/${item.id.split('-')[0]}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-lg font-bold text-primary">{item.price}€</p>

                      {/* Quantity */}
                      <div className="flex items-center gap-3 pt-2">
                        <label className="text-sm text-foreground">Quantité:</label>
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 text-foreground hover:bg-secondary transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 text-center border-0 bg-transparent text-foreground focus:outline-none text-sm"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-foreground hover:bg-secondary transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total & Delete */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-bold text-foreground">{(item.price * item.quantity).toFixed(2)}€</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6 sticky top-20">
                <h2 className="text-xl font-serif font-bold text-foreground">Résumé commande</h2>

                <div className="space-y-3 py-4 border-t border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium text-foreground">{totalPrice.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium text-foreground">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span className="font-medium text-foreground">{(totalPrice * 0.2).toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-xl">{(totalPrice * 1.2).toFixed(2)}€</span>
                </div>

                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg"
                  >
                    Procéder au paiement
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={clearCart}
                >
                  Vider le panier
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
