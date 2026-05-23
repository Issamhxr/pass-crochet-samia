'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    setOrderNumber(Math.random().toString(36).substring(2, 11).toUpperCase())
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="flex justify-center">
            <CheckCircle size={80} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground">Paiement réussi !</h1>
          <p className="text-lg text-muted-foreground">
            Merci pour votre achat. Votre commande a été confirmée et nous procédons actuellement à sa préparation.
          </p>

          <div className="bg-secondary/30 rounded-lg p-4 space-y-2 text-left">
            <p className="text-sm text-muted-foreground">
              <strong>Numéro de commande :</strong>{' '}
              {orderNumber ? `#${orderNumber}` : '—'}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Email :</strong> Vous recevrez une confirmation par email dans quelques instants.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Livraison :</strong> Gratuite — vous serez informé du suivi de votre commande.
            </p>
          </div>

          <div className="space-y-3 pt-6">
            <Link href="/">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Retour à l&apos;accueil
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Continuer vos achats
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
