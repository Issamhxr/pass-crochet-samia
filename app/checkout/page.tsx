'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowLeft, Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

declare global {
  interface Window { paypal?: any }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState<'paypal' | null>(null)
  const [loading, setLoading] = useState(false)
  const [paypalReady, setPaypalReady] = useState(false)
  const [paypalRendered, setPaypalRendered] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France',
  })

  // Refs so PayPal callbacks always see latest values without re-rendering buttons
  const formDataRef = useRef(formData)
  const itemsRef = useRef(items)
  const isFormValidRef = useRef(false)
  const paypalContainerRef = useRef<HTMLDivElement>(null)
  const paypalButtonsRef = useRef<any>(null)

  useEffect(() => { formDataRef.current = formData }, [formData])
  useEffect(() => { itemsRef.current = items }, [items])

  const subtotal = totalPrice
  const tax = subtotal * 0.2
  const finalTotal = subtotal + tax

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.zipCode.trim() !== ''

  useEffect(() => { isFormValidRef.current = isFormValid }, [isFormValid])

  // Load PayPal JS SDK once on mount
  useEffect(() => {
    if (document.getElementById('paypal-sdk')) {
      if (window.paypal) setPaypalReady(true)
      return
    }
    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=EUR&locale=fr_FR`
    script.async = true
    script.onload = () => setPaypalReady(true)
    script.onerror = () => setErrorMsg('Impossible de charger PayPal. Vérifiez votre connexion.')
    document.body.appendChild(script)
  }, [])

  // Render PayPal buttons once the container is in DOM and SDK is loaded
  const renderPaypalButtons = useCallback(() => {
    if (!window.paypal || !paypalContainerRef.current || paypalButtonsRef.current) return

    const buttons = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 48 },

      createOrder: async () => {
        if (!isFormValidRef.current) {
          setErrorMsg('Veuillez remplir tous les champs obligatoires (*) avant de payer.')
          throw new Error('Form incomplete')
        }
        setErrorMsg(null)
        setLoading(true)
        try {
          const res = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsRef.current, customer: formDataRef.current }),
          })
          const data = await res.json()
          if (!res.ok || !data.orderID) throw new Error(data.error ?? 'Échec de la création de commande')
          return data.orderID
        } catch (err: any) {
          setLoading(false)
          throw err
        }
      },

      onApprove: async (data: { orderID: string }) => {
        setLoading(true)
        setErrorMsg(null)
        try {
          const res = await fetch('/api/capture-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          })
          const result = await res.json()
          if (!res.ok || !result.success) throw new Error(result.error ?? 'Échec de la confirmation')
          clearCart()
          router.push('/success')
        } catch (err: any) {
          setErrorMsg(err.message ?? 'Erreur lors de la confirmation du paiement.')
          setLoading(false)
        }
      },

      onCancel: () => {
        setLoading(false)
        setErrorMsg('Paiement annulé. Vous pouvez réessayer.')
      },

      onError: (err: any) => {
        console.error('PayPal error:', err)
        setLoading(false)
        setErrorMsg('Une erreur PayPal est survenue. Veuillez réessayer.')
      },
    })

    if (buttons.isEligible()) {
      buttons.render(paypalContainerRef.current)
      paypalButtonsRef.current = buttons
      setPaypalRendered(true)
    }
  }, [clearCart, router])

  // Trigger button rendering when paypal is selected and SDK is ready
  useEffect(() => {
    if (paymentMethod === 'paypal' && paypalReady && !paypalRendered) {
      // Small timeout to ensure the container div is mounted
      const id = setTimeout(renderPaypalButtons, 50)
      return () => clearTimeout(id)
    }
  }, [paymentMethod, paypalReady, paypalRendered, renderPaypalButtons])

  // Cleanup buttons when switching away from PayPal
  useEffect(() => {
    if (paymentMethod !== 'paypal') {
      if (paypalButtonsRef.current) {
        paypalButtonsRef.current.close?.()
        paypalButtonsRef.current = null
      }
      setPaypalRendered(false)
    }
  }, [paymentMethod])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const inputClass = 'px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            <Package size={64} className="text-muted-foreground/30 mx-auto" />
            <h1 className="text-3xl font-serif font-bold text-foreground">Panier vide</h1>
            <p className="text-muted-foreground">Retournez à la boutique pour ajouter des articles.</p>
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-primary-foreground">Retour à la boutique</Button>
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
        <div className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft size={16} />
              Retour au panier
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Paiement</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left — form + payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping form */}
              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Informations de livraison</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" name="firstName" placeholder="Prénom *" value={formData.firstName} onChange={handleFormChange} className={inputClass} />
                  <input type="text" name="lastName" placeholder="Nom *" value={formData.lastName} onChange={handleFormChange} className={inputClass} />
                </div>
                <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleFormChange} className={`w-full ${inputClass}`} />
                <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleFormChange} className={`w-full ${inputClass}`} />
                <input type="text" name="address" placeholder="Adresse *" value={formData.address} onChange={handleFormChange} className={`w-full ${inputClass}`} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" name="city" placeholder="Ville *" value={formData.city} onChange={handleFormChange} className={inputClass} />
                  <input type="text" name="zipCode" placeholder="Code postal *" value={formData.zipCode} onChange={handleFormChange} className={inputClass} />
                </div>
              </Card>

              {/* Payment method */}
              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Méthode de paiement</h2>

                {/* PayPal option */}
                <button
                  onClick={() => { setPaymentMethod('paypal'); setErrorMsg(null) }}
                  className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                    paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === 'paypal' ? 'border-primary bg-primary' : 'border-border'}`} />
                    <div>
                      <p className="font-semibold text-foreground">PayPal</p>
                      <p className="text-sm text-muted-foreground">Paiement sécurisé — carte bancaire ou compte PayPal</p>
                    </div>
                    <img
                      src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                      alt="PayPal"
                      className="ml-auto h-6"
                    />
                  </div>
                </button>

                {/* Error */}
                {errorMsg && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    {errorMsg}
                  </div>
                )}

                {/* PayPal button area — always mounted once PayPal is selected */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-3">
                    {!isFormValid && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        Remplissez les champs obligatoires (*) ci-dessus, puis cliquez sur le bouton PayPal.
                      </div>
                    )}

                    {/* PayPal SDK buttons container — always in DOM so buttons render immediately */}
                    <div className="min-h-[56px] relative">
                      {!paypalReady && (
                        <div className="flex items-center justify-center gap-2 h-14 text-sm text-muted-foreground">
                          <Loader2 size={16} className="animate-spin" />
                          Chargement de PayPal…
                        </div>
                      )}
                      <div ref={paypalContainerRef} className={paypalReady ? 'block' : 'hidden'} />
                    </div>

                    {loading && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-1">
                        <Loader2 size={14} className="animate-spin" />
                        Traitement en cours…
                      </div>
                    )}
                  </div>
                )}

                {/* Select method prompt */}
                {!paymentMethod && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Sélectionnez une méthode de paiement pour continuer.
                  </p>
                )}
              </Card>

              {/* Security note */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                Paiement 100% sécurisé par PayPal. Vos données bancaires ne transitent jamais par notre site.
              </div>
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6 sticky top-20">
                <h2 className="text-xl font-serif font-bold text-foreground">Résumé commande</h2>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm pb-3 border-b border-border last:border-0">
                      <div className="relative w-14 h-14 flex-shrink-0 rounded bg-muted/30 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground line-clamp-2 text-xs">{item.name}</p>
                        <p className="text-muted-foreground text-xs">Qté: {item.quantity}</p>
                        <p className="font-semibold text-primary text-sm">{(item.price * item.quantity).toFixed(2)}€</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4 border-t border-b border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-medium">{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium text-green-600">Gratuite</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span className="font-medium">{tax.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary text-xl">{finalTotal.toFixed(2)}€</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
