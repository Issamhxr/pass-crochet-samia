'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  Save, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Link2,
  CreditCard, Store, Lock,
} from 'lucide-react'

interface PaypalSettings { clientId: string; clientSecret: string; mode: 'sandbox' | 'live' }
interface StoreSettings { name: string; email: string; phone: string; address: string }

const defaultStore: StoreSettings = {
  name: 'Pass-Crochet Samia',
  email: 'contact@pass-crochet.com',
  phone: '',
  address: 'France',
}

export default function SettingsPage() {
  const [tab, setTab] = useState<'payment' | 'store' | 'account'>('payment')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const [paypal, setPaypal] = useState<PaypalSettings>({ clientId: '', clientSecret: '', mode: 'sandbox' })
  const [showSecret, setShowSecret] = useState(false)
  const [paypalTesting, setPaypalTesting] = useState(false)
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [savingPaypal, setSavingPaypal] = useState(false)

  const [store, setStore] = useState<StoreSettings>(defaultStore)
  const [savingStore, setSavingStore] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setAdminEmail(user?.email || ''))

    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.paypal) {
          setPaypal({
            clientId: d.paypal.clientId || '',
            clientSecret: d.paypal.clientSecretMasked || '',
            mode: d.paypal.mode || 'sandbox',
          })
        }
        if (d.store) setStore({ ...defaultStore, ...d.store })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const savePaypal = async () => {
    setSavingPaypal(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paypal }),
      })
      flash(res.ok ? 'Paramètres PayPal sauvegardés !' : 'Erreur lors de la sauvegarde', res.ok)
    } catch {
      flash('Erreur réseau', false)
    }
    setSavingPaypal(false)
  }

  const testPaypal = async () => {
    setPaypalTesting(true)
    setPaypalStatus('idle')
    try {
      const base = paypal.mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
      const creds = btoa(`${paypal.clientId}:${paypal.clientSecret}`)
      const res = await fetch(`${base}/v1/oauth2/token`, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=client_credentials',
      })
      setPaypalStatus(res.ok ? 'ok' : 'fail')
    } catch {
      setPaypalStatus('fail')
    }
    setPaypalTesting(false)
  }

  const saveStore = async () => {
    setSavingStore(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store }),
      })
      flash(res.ok ? 'Coordonnées de la boutique sauvegardées !' : 'Erreur lors de la sauvegarde', res.ok)
    } catch {
      flash('Erreur réseau', false)
    }
    setSavingStore(false)
  }

  const changePassword = async () => {
    if (newPassword.length < 6) { flash('Le mot de passe doit faire au moins 6 caractères', false); return }
    if (newPassword !== confirmPassword) { flash('Les mots de passe ne correspondent pas', false); return }
    setSavingPwd(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) flash(error.message, false)
    else { flash('Mot de passe mis à jour !'); setNewPassword(''); setConfirmPassword('') }
    setSavingPwd(false)
  }

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  const tabs = [
    { id: 'payment' as const, label: 'Paiement', icon: CreditCard },
    { id: 'store' as const, label: 'Boutique', icon: Store },
    { id: 'account' as const, label: 'Compte', icon: Lock },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" /> Chargement...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Paiement, coordonnées de la boutique et sécurité du compte</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ── PAIEMENT ── */}
      {tab === 'payment' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-7" />
            <div>
              <h2 className="font-semibold text-foreground">Connexion PayPal Business</h2>
              <p className="text-xs text-muted-foreground">Identifiants depuis votre compte PayPal Développeur</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Mode</label>
            <div className="flex gap-3">
              {(['sandbox', 'live'] as const).map(m => (
                <button key={m} onClick={() => setPaypal(p => ({ ...p, mode: m }))}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    paypal.mode === m ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {m === 'sandbox' ? '🧪 Sandbox (test)' : '🚀 Live (production)'}
                </button>
              ))}
            </div>
            {paypal.mode === 'live' && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle size={12} /> Mode Live : les paiements sont réels.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Client ID</label>
            <input value={paypal.clientId} onChange={e => setPaypal(p => ({ ...p, clientId: e.target.value }))} className={inputClass} placeholder="Votre PayPal Client ID" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Client Secret</label>
            <div className="relative">
              <input type={showSecret ? 'text' : 'password'} value={paypal.clientSecret}
                onChange={e => setPaypal(p => ({ ...p, clientSecret: e.target.value }))}
                className={`${inputClass} pr-10`} placeholder="Votre PayPal Client Secret" />
              <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 space-y-1">
            <p className="font-medium flex items-center gap-1"><Link2 size={14} /> Comment trouver vos identifiants</p>
            <ol className="list-decimal list-inside space-y-0.5 text-xs">
              <li>Connectez-vous sur <strong>developer.paypal.com</strong></li>
              <li>Allez dans <strong>My Apps & Credentials</strong></li>
              <li>Choisissez <strong>Sandbox</strong> ou <strong>Live</strong></li>
              <li>Copiez le <strong>Client ID</strong> et <strong>Secret</strong></li>
            </ol>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={testPaypal} disabled={paypalTesting || !paypal.clientId || !paypal.clientSecret} variant="outline" className="gap-2">
              {paypalTesting ? <><Loader2 size={15} className="animate-spin" /> Test...</> : 'Tester la connexion'}
            </Button>
            {paypalStatus === 'ok' && <span className="flex items-center gap-1 text-sm text-green-600 font-medium"><CheckCircle size={16} /> Connexion réussie !</span>}
            {paypalStatus === 'fail' && <span className="flex items-center gap-1 text-sm text-red-600 font-medium"><AlertCircle size={16} /> Identifiants incorrects</span>}
          </div>

          <Button onClick={savePaypal} disabled={savingPaypal} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            {savingPaypal ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer les paramètres PayPal
          </Button>
        </Card>
      )}

      {/* ── BOUTIQUE ── */}
      {tab === 'store' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Coordonnées de la boutique</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nom de la boutique</label>
            <input value={store.name} onChange={e => setStore(s => ({ ...s, name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email de contact</label>
            <input type="email" value={store.email} onChange={e => setStore(s => ({ ...s, email: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
            <input type="tel" value={store.phone} onChange={e => setStore(s => ({ ...s, phone: e.target.value }))} className={inputClass} placeholder="+33 6 XX XX XX XX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Adresse</label>
            <textarea value={store.address} onChange={e => setStore(s => ({ ...s, address: e.target.value }))} rows={2} className={inputClass} />
          </div>
          <Button onClick={saveStore} disabled={savingStore} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            {savingStore ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Enregistrer
          </Button>
        </Card>
      )}

      {/* ── COMPTE ── */}
      {tab === 'account' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Compte administrateur</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input value={adminEmail} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
            <p className="text-xs text-muted-foreground mt-1">L'email de connexion se modifie depuis Supabase → Authentication.</p>
          </div>
          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-sm font-medium text-foreground">Changer le mot de passe</p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  className={`${inputClass} pr-10`} placeholder="Minimum 6 caractères" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirmer le mot de passe</label>
              <input type={showPwd ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Retapez le mot de passe" />
            </div>
            <Button onClick={changePassword} disabled={savingPwd || !newPassword || !confirmPassword} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              {savingPwd ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Mettre à jour le mot de passe
            </Button>
          </div>
        </Card>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.ok ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.ok ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
