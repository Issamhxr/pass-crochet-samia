'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { User, LogOut, Eye, EyeOff, AlertCircle, Check, ShoppingBag, UserCircle2, Loader2 } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function ComptePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data))
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('full_name, role').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.refresh()
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      <section className="flex-1 bg-background py-16 px-4">
        <div className="mx-auto max-w-lg">
          {user ? (
            <LoggedInView user={user} profile={profile} onLogout={handleLogout} />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-8 border-b border-border">
                <button
                  onClick={() => setTab('login')}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                    tab === 'login' ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  onClick={() => setTab('register')}
                  className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                    tab === 'register' ? 'text-primary border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {tab === 'login' ? (
                <LoginForm onSuccess={() => router.refresh()} />
              ) : (
                <RegisterForm onSuccess={() => setTab('login')} />
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function LoggedInView({ user, profile, onLogout }: {
  user: SupabaseUser
  profile: { full_name: string; role: string } | null
  onLogout: () => void
}) {
  const roleLabels: Record<string, string> = { admin: 'Administrateur', vendeur: 'Vendeur', client: 'Client' }
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-4">
          {(profile?.full_name || user.email || '?')[0].toUpperCase()}
        </div>
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Bonjour{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''} !
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
        {profile?.role && (
          <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {roleLabels[profile.role] || profile.role}
          </span>
        )}
      </div>

      <div className="grid gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle2 size={20} className="text-primary" />
            <h2 className="font-semibold text-foreground">Mon profil</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom</span>
              <span className="font-medium text-foreground">{profile?.full_name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compte créé</span>
              <span className="font-medium text-foreground">
                {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="font-semibold text-foreground">Mes commandes</h2>
          </div>
          <p className="text-sm text-muted-foreground">Vous n'avez pas encore de commandes.</p>
        </Card>
      </div>

      <Button onClick={onLogout} variant="outline" className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
        <LogOut size={16} />
        Se déconnecter
      </Button>
    </div>
  )
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('Email ou mot de passe incorrect.')
    else onSuccess()
    setLoading(false)
  }

  const inputClass = 'w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <Card className="p-8">
      <h2 className="text-xl font-serif font-bold text-foreground mb-6 text-center">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className={`${inputClass} pr-12`} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}
        <Button type="submit" disabled={loading || !email || !password} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </Card>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'client' } },
    })
    if (authError) setError(authError.message)
    else setSuccess(true)
    setLoading(false)
  }

  const inputClass = 'w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'

  if (success) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-serif font-bold text-foreground">Compte créé !</h2>
        <p className="text-muted-foreground text-sm">
          Un email de confirmation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte mail pour activer votre compte.
        </p>
        <Button onClick={onSuccess} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          Se connecter
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <h2 className="text-xl font-serif font-bold text-foreground mb-6 text-center">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Prénom Nom" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 caractères" required className={`${inputClass} pr-12`} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </div>
        )}
        <Button type="submit" disabled={loading || !email || !password || !fullName} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
          {loading ? 'Création...' : 'Créer mon compte'}
        </Button>
      </form>
    </Card>
  )
}
