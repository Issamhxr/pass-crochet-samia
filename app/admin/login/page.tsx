'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    // Verify the user actually has admin role in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut()
      setError('Accès refusé. Ce compte n\'a pas les droits d\'administration.')
      setLoading(false)
      return
    }

    // Hard redirect so middleware sees fresh cookies
    window.location.href = from
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Pass-Crochet Samia</h1>
          <p className="text-muted-foreground mt-1">Accès administration</p>
        </div>

        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoFocus
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  required
                  className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading || !email || !password}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
