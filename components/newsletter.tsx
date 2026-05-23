'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section className="w-full py-14 bg-gradient-to-b from-background to-secondary/30 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-foreground">
              Restez informée
            </h2>
            <p className="text-muted-foreground">
              Inscrivez-vous pour recevoir les nouvelles créations et les offres exclusives
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <Button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold px-8 shadow-md hover:shadow-lg transition-all"
            >
              S&apos;inscrire
            </Button>
          </form>

          {submitted && (
            <p className="text-sm text-primary font-medium animate-in fade-in">
              Merci ! Vous recevrez bientôt nos actualités.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
