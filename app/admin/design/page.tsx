'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Upload, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Link2 } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────── */
interface SiteSettings {
  siteName: string; siteDescription: string; companyName: string
  primaryColor: string; secondaryColor: string; accentColor: string
  backgroundColor: string; foregroundColor: string
  email: string; phone: string; address: string
  instagram: string; facebook: string; tiktok: string
  footerDescription: string; metaDescription: string; keywords: string
}

interface PaypalSettings {
  clientId: string; clientSecret: string; mode: 'sandbox' | 'live'
}

const defaultSite: SiteSettings = {
  siteName: 'Pass-Crochet Samia', siteDescription: 'Univers doux et authentique de créations faites main',
  companyName: 'Pass-Crochet Samia',
  primaryColor: '#c9a96e', secondaryColor: '#f5ede4', accentColor: '#d4a5a5',
  backgroundColor: '#faf8f3', foregroundColor: '#5a4a42',
  email: 'contact@pass-crochet.com', phone: '+33 (0)6 XX XX XX XX', address: 'France',
  instagram: '', facebook: '', tiktok: '',
  footerDescription: 'Créations faites main avec passion, patience et amour.',
  metaDescription: 'Découvrez l\'univers doux et authentique de Pass-Crochet Samia',
  keywords: 'crochet, amigurumi, handmade, artisanal, sacs',
}

const SITE_IMAGES = [
  { key: 'hero-crochet.jpg', label: 'Image Héro (page d\'accueil)', path: '/images/hero-crochet.jpg' },
  { key: 'about-crochet.jpg', label: 'Image À propos', path: '/images/about-crochet.jpg' },
  { key: 'workshop-crochet.jpg', label: 'Image Ateliers', path: '/images/workshop-crochet.jpg' },
  { key: 'product-1.jpg', label: 'Produit 1 — Amigurumi Ours', path: '/images/product-1.jpg' },
  { key: 'product-2.jpg', label: 'Produit 2 — Sac à Main Granny', path: '/images/product-2.jpg' },
  { key: 'product-3.jpg', label: 'Produit 3 — Pochette Rose', path: '/images/product-3.jpg' },
  { key: 'product-4.jpg', label: 'Produit 4 — Porte-clés Coloré', path: '/images/product-4.jpg' },
  { key: 'product-5.jpg', label: 'Produit 5 — Amigurumi Chat', path: '/images/product-5.jpg' },
  { key: 'product-6.jpg', label: 'Produit 6 — Sac d\'Enfant', path: '/images/product-6.jpg' },
]

/* ─── Component ─────────────────────────────────────────── */
export default function DesignPage() {
  const [tab, setTab] = useState('images')
  const [site, setSite] = useState<SiteSettings>(defaultSite)
  const [paypal, setPaypal] = useState<PaypalSettings>({ clientId: '', clientSecret: '', mode: 'sandbox' })
  const [showSecret, setShowSecret] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({})
  const [paypalTesting, setPaypalTesting] = useState(false)
  const [paypalStatus, setPaypalStatus] = useState<'idle' | 'ok' | 'fail'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentUploadKey = useRef<string>('')

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  /* Load saved settings */
  useEffect(() => {
    try {
      const s = localStorage.getItem('siteSettings')
      if (s) setSite(prev => ({ ...prev, ...JSON.parse(s) }))
    } catch { /* ignore */ }

    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d.paypal) {
          setPaypal(prev => ({
            ...prev,
            clientId: d.paypal.clientId || '',
            clientSecret: d.paypal.clientSecretMasked || '',
            mode: d.paypal.mode || 'sandbox',
          }))
        }
      })
      .catch(() => { /* ignore */ })
      .finally(() => setLoading(false))
  }, [])

  /* Save site settings */
  const saveSite = () => {
    localStorage.setItem('siteSettings', JSON.stringify(site))
    flash('Paramètres du site sauvegardés !')
  }

  /* Save PayPal settings */
  const savePaypal = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paypal }),
      })
      if (res.ok) flash('Paramètres PayPal sauvegardés !')
      else flash('Erreur lors de la sauvegarde', false)
    } catch {
      flash('Erreur réseau', false)
    }
  }

  /* Test PayPal connection */
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
    } finally {
      setPaypalTesting(false)
    }
  }

  /* Upload image */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUploadKey.current) return
    const key = currentUploadKey.current
    setUploadingKey(key)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('target', key)

    try {
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setImagePreviews(p => ({ ...p, [key]: `${data.path}?t=${Date.now()}` }))
        flash(`Image "${key}" mise à jour !`)
      } else {
        flash(data.error || 'Erreur upload', false)
      }
    } catch {
      flash('Erreur lors du téléchargement', false)
    } finally {
      setUploadingKey(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (key: string) => {
    currentUploadKey.current = key
    fileInputRef.current?.click()
  }

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  const tabs = [
    { id: 'images', label: 'Images', emoji: '🖼️' },
    { id: 'branding', label: 'Marque', emoji: '🏷️' },
    { id: 'colors', label: 'Couleurs', emoji: '🎨' },
    { id: 'social', label: 'Réseaux', emoji: '📱' },
    { id: 'seo', label: 'SEO', emoji: '🔍' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        Chargement...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Design & Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Personnalisez l'apparence et les paramètres de votre site</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="mr-1.5">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── IMAGES ── */}
      {tab === 'images' && (
        <div className="space-y-4">
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />

          <div className="grid gap-4">
            {SITE_IMAGES.map(img => {
              const preview = imagePreviews[img.key]
              const src = preview || img.path
              return (
                <Card key={img.key} className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted/30 border border-border">
                      <Image src={src} alt={img.label} fill className="object-cover" unoptimized />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{img.label}</p>
                      <p className="text-xs text-muted-foreground font-mono truncate">{img.path}</p>
                      {preview && <p className="text-xs text-green-600 mt-0.5">✓ Mis à jour</p>}
                    </div>

                    {/* Upload button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerUpload(img.key)}
                      disabled={uploadingKey === img.key}
                      className="flex-shrink-0 gap-2"
                    >
                      {uploadingKey === img.key ? (
                        <><Loader2 size={14} className="animate-spin" /> Envoi...</>
                      ) : (
                        <><Upload size={14} /> Changer</>
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          <p className="text-xs text-muted-foreground">Formats acceptés: JPG, PNG, WebP — Max 5MB par image</p>
        </div>
      )}

      {/* ── PAYPAL ── */}
      {tab === 'paypal' && (
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-7" />
            <div>
              <h2 className="font-semibold text-foreground">Connexion PayPal Business</h2>
              <p className="text-xs text-muted-foreground">Entrez vos identifiants depuis votre compte PayPal Développeur</p>
            </div>
          </div>

          {/* Mode */}
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

          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Client ID</label>
            <input value={paypal.clientId} onChange={e => setPaypal(p => ({ ...p, clientId: e.target.value }))}
              className={inputClass} placeholder="Votre PayPal Client ID" />
            <p className="text-xs text-muted-foreground mt-1">Visible dans votre tableau de bord PayPal Développeur</p>
          </div>

          {/* Client Secret */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Client Secret</label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                value={paypal.clientSecret}
                onChange={e => setPaypal(p => ({ ...p, clientSecret: e.target.value }))}
                className={`${inputClass} pr-10`}
                placeholder="Votre PayPal Client Secret"
              />
              <button type="button" onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* How to find */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800 space-y-1">
            <p className="font-medium flex items-center gap-1"><Link2 size={14} /> Comment trouver vos identifiants</p>
            <ol className="list-decimal list-inside space-y-0.5 text-xs">
              <li>Connectez-vous sur <strong>developer.paypal.com</strong></li>
              <li>Allez dans <strong>My Apps & Credentials</strong></li>
              <li>Choisissez <strong>Sandbox</strong> ou <strong>Live</strong></li>
              <li>Créez ou sélectionnez une application</li>
              <li>Copiez le <strong>Client ID</strong> et <strong>Secret</strong></li>
            </ol>
          </div>

          {/* Test + Status */}
          <div className="flex items-center gap-3">
            <Button onClick={testPaypal} disabled={paypalTesting || !paypal.clientId || !paypal.clientSecret}
              variant="outline" className="gap-2">
              {paypalTesting ? <><Loader2 size={15} className="animate-spin" /> Test...</> : 'Tester la connexion'}
            </Button>
            {paypalStatus === 'ok' && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle size={16} /> Connexion réussie !
              </span>
            )}
            {paypalStatus === 'fail' && (
              <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                <AlertCircle size={16} /> Identifiants incorrects
              </span>
            )}
          </div>

          <Button onClick={savePaypal} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Save size={16} /> Enregistrer les paramètres PayPal
          </Button>
        </Card>
      )}

      {/* ── BRANDING ── */}
      {tab === 'branding' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Informations de la marque</h2>
          {([
            { key: 'siteName', label: 'Nom du site', type: 'input' },
            { key: 'companyName', label: 'Nom de l\'entreprise', type: 'input' },
            { key: 'siteDescription', label: 'Description', type: 'textarea' },
            { key: 'footerDescription', label: 'Description pied de page', type: 'textarea' },
          ] as const).map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={site[f.key]} onChange={e => setSite(p => ({ ...p, [f.key]: e.target.value }))} rows={2} className={inputClass} />
              ) : (
                <input value={site[f.key]} onChange={e => setSite(p => ({ ...p, [f.key]: e.target.value }))} className={inputClass} />
              )}
            </div>
          ))}
          <Button onClick={saveSite} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2">
            <Save size={16} /> Enregistrer
          </Button>
        </Card>
      )}

      {/* ── COLORS ── */}
      {tab === 'colors' && (
        <Card className="p-6 space-y-5">
          <h2 className="font-semibold text-foreground">Palette de couleurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { key: 'primaryColor', label: 'Couleur Primaire' },
              { key: 'secondaryColor', label: 'Couleur Secondaire' },
              { key: 'accentColor', label: 'Couleur Accent' },
              { key: 'backgroundColor', label: 'Fond' },
              { key: 'foregroundColor', label: 'Texte' },
            ] as const).map(c => (
              <div key={c.key}>
                <label className="block text-xs font-medium text-foreground mb-1">{c.label}</label>
                <div className="flex gap-2">
                  <input type="color" value={site[c.key]} onChange={e => setSite(p => ({ ...p, [c.key]: e.target.value }))}
                    className="w-12 h-9 rounded border border-border cursor-pointer p-0.5 bg-background" />
                  <input type="text" value={site[c.key]} onChange={e => setSite(p => ({ ...p, [c.key]: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
              </div>
            ))}
          </div>
          {/* Preview */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Aperçu</p>
            <div className="flex gap-2 rounded-lg overflow-hidden border border-border h-10">
              {(['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 'foregroundColor'] as const).map(k => (
                <div key={k} className="flex-1" style={{ backgroundColor: site[k] }} title={site[k]} />
              ))}
            </div>
          </div>
          <Button onClick={saveSite} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Save size={16} /> Enregistrer
          </Button>
        </Card>
      )}

      {/* ── CONTACT ── */}
      {tab === 'contact' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Informations de contact</h2>
          {([
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Téléphone', type: 'tel' },
            { key: 'address', label: 'Adresse', type: 'textarea' },
          ] as const).map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea value={site[f.key]} onChange={e => setSite(p => ({ ...p, [f.key]: e.target.value }))} rows={2} className={inputClass} />
              ) : (
                <input type={f.type} value={site[f.key]} onChange={e => setSite(p => ({ ...p, [f.key]: e.target.value }))} className={inputClass} />
              )}
            </div>
          ))}
          <Button onClick={saveSite} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Save size={16} /> Enregistrer
          </Button>
        </Card>
      )}

      {/* ── SOCIAL ── */}
      {tab === 'social' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Réseaux sociaux</h2>
          {([
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
            { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
          ] as const).map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
              <input type="url" value={site[f.key]} onChange={e => setSite(p => ({ ...p, [f.key]: e.target.value }))} className={inputClass} placeholder={f.placeholder} />
            </div>
          ))}
          <Button onClick={saveSite} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Save size={16} /> Enregistrer
          </Button>
        </Card>
      )}

      {/* ── SEO ── */}
      {tab === 'seo' && (
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Référencement (SEO)</h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Méta description</label>
            <textarea value={site.metaDescription} onChange={e => setSite(p => ({ ...p, metaDescription: e.target.value }))} rows={2} maxLength={160} className={inputClass} />
            <p className="text-xs text-muted-foreground mt-1">{site.metaDescription.length}/160 caractères</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mots-clés</label>
            <input value={site.keywords} onChange={e => setSite(p => ({ ...p, keywords: e.target.value }))} className={inputClass} placeholder="crochet, amigurumi, handmade" />
            <p className="text-xs text-muted-foreground mt-1">Séparés par des virgules</p>
          </div>
          <Button onClick={saveSite} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Save size={16} /> Enregistrer
          </Button>
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
