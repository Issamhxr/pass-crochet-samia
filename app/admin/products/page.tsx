'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  supabase, dbToProduct, productToDb,
  generateCombos, comboKey,
  type ProductAttribute, type ProductCombo, type ProductVariations,
} from '@/lib/supabase'
import { CATEGORIES } from '@/lib/products-data'
import {
  Plus, Edit, Trash2, Search, X, Check, Package, Loader2, Star,
  Upload, ImageIcon, Palette, Settings2, FileText, Sparkles,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  stock: number
  inStock: boolean
  description: string
  materials: string
  dimensions: string
  careInstructions: string
  relatedProducts: string[]
  variants: any[]
  variations: ProductVariations
  rating: number
  reviews: number
  featured: boolean
}

const blank: Omit<Product, 'id'> = {
  name: '', category: CATEGORIES[0], price: 0,
  image: '', stock: 0,
  inStock: true, description: '',
  materials: '', dimensions: '', careInstructions: '',
  relatedProducts: [], variants: [], variations: { attributes: [], combos: [] },
  rating: 5.0, reviews: 0,
  featured: false,
}

type Tab = 'general' | 'variants' | 'advanced'

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(blank)
  const [tab, setTab] = useState<Tab>('general')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('categories').select('name').order('position').order('id'),
    ])
    if (prods) setProducts(prods.map(dbToProduct) as Product[])
    if (cats && cats.length > 0) setCategories(cats.map(c => c.name))
    setLoading(false)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()),
  )

  const openAdd = () => {
    setForm({ ...blank, category: categories[0] || CATEGORIES[0] })
    setEditingId(null)
    setUploadError('')
    setTab('general')
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, price: p.price,
      image: p.image, stock: p.stock, inStock: p.inStock,
      description: p.description, materials: p.materials,
      dimensions: p.dimensions, careInstructions: p.careInstructions,
      relatedProducts: p.relatedProducts, variants: p.variants || [],
      variations: p.variations || { attributes: [], combos: [] },
      rating: p.rating, reviews: p.reviews, featured: p.featured,
    })
    setEditingId(p.id)
    setUploadError('')
    setTab('general')
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      flash()
    }
  }

  const handleSave = async () => {
    if (!form.name.trim() || form.price <= 0) return
    setSaving(true)
    const id = editingId || String(Date.now())
    const row = productToDb({ ...form, id } as any)
    const { error } = await supabase.from('products').upsert(row)
    if (!error) {
      await loadAll()
      setModalOpen(false)
      flash()
    } else {
      console.error('Save error:', error)
      alert('Erreur de sauvegarde: ' + error.message)
    }
    setSaving(false)
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok && data.path) {
        setForm(p => ({ ...p, image: data.path }))
      } else {
        setUploadError(data.error || 'Erreur de téléchargement')
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Erreur réseau')
    }
    setUploading(false)
  }

  // ---- Attribute editor helpers ----
  const attributes = form.variations.attributes
  const combos = form.variations.combos

  const setVariations = (patch: Partial<ProductVariations>) => {
    setForm(p => ({ ...p, variations: { ...p.variations, ...patch } }))
  }

  const addAttribute = () => {
    setVariations({ attributes: [...attributes, { label: '', values: [] }] })
  }
  const updateAttributeLabel = (idx: number, label: string) => {
    setVariations({ attributes: attributes.map((a, i) => i === idx ? { ...a, label } : a) })
  }
  const removeAttribute = (idx: number) => {
    setVariations({ attributes: attributes.filter((_, i) => i !== idx) })
  }
  const addAttributeValue = (idx: number, value: string) => {
    const v = value.trim()
    if (!v) return
    setVariations({
      attributes: attributes.map((a, i) =>
        i === idx && !a.values.includes(v) ? { ...a, values: [...a.values, v] } : a,
      ),
    })
  }
  const removeAttributeValue = (idx: number, value: string) => {
    setVariations({
      attributes: attributes.map((a, i) =>
        i === idx ? { ...a, values: a.values.filter(x => x !== value) } : a,
      ),
    })
  }

  // Generate / regenerate the combination matrix, preserving prices/stock already set
  const generateMatrix = () => {
    const optionMaps = generateCombos(attributes)
    const existing = new Map(combos.map(c => [c.key, c]))
    const newCombos: ProductCombo[] = optionMaps.map(options => {
      const key = comboKey(options)
      const prev = existing.get(key)
      return {
        key,
        options,
        price: prev?.price ?? form.price,
        stock: prev?.stock ?? 0,
      }
    })
    setVariations({ combos: newCombos })
  }

  const updateCombo = (key: string, patch: Partial<ProductCombo>) => {
    setVariations({ combos: combos.map(c => c.key === key ? { ...c, ...patch } : c) })
  }

  const validAttrCount = attributes.filter(a => a.label.trim() && a.values.length > 0).length

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'
  const smallInputClass = 'px-2 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'general', label: 'Général', icon: FileText },
    { id: 'variants', label: 'Variantes', icon: Palette },
    { id: 'advanced', label: 'Avancé', icon: Settings2 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Produits</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez votre catalogue</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Sauvegardé</span>}
          <Button onClick={openAdd} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus size={16} /> Ajouter un produit
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 bg-card max-w-sm">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-foreground placeholder-muted-foreground"
        />
        {search && <button onClick={() => setSearch('')}><X size={14} className="text-muted-foreground" /></button>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
          <p className="text-xs text-muted-foreground">Total produits</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.inStock).length}</p>
          <p className="text-xs text-muted-foreground">En vente</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{products.filter(p => p.featured).length}/6</p>
          <p className="text-xs text-muted-foreground">En vedette</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{products.reduce((s, p) => s + p.stock, 0)}</p>
          <p className="text-xs text-muted-foreground">Unités totales</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Produit</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden sm:table-cell">Catégorie</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Prix</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden md:table-cell">Stock</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Statut</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                          {product.image
                            ? <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                            : <div className="absolute inset-0 flex items-center justify-center text-muted-foreground"><ImageIcon size={16} /></div>}
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                        {product.featured && (
                          <span title="Affiché sur la page d'accueil">
                            <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                          </span>
                        )}
                        {product.variations?.combos?.length > 0 && (
                          <span title={`${product.variations.combos.length} variation(s)`} className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            <Palette size={11} />
                            {product.variations.combos.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{product.category}</td>
                    <td className="px-5 py-3 font-semibold text-foreground">{product.price}€</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 5 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>{product.stock} unités</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.inStock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>{product.inStock ? 'Actif' : 'Inactif'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit size={15} /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Package size={40} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold text-foreground">
                {editingId ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded hover:bg-secondary"><X size={18} /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-6 shrink-0">
              {tabs.map(t => {
                const Icon = t.icon
                const active = tab === t.id
                const count = t.id === 'variants' && combos.length > 0 ? combos.length : null
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      active
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={15} />
                    {t.label}
                    {count !== null && (
                      <span className="bg-primary/15 text-primary text-xs px-1.5 rounded-full">{count}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* ---- GÉNÉRAL ---- */}
              {tab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Nom du produit *</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Ex: Amigurumi Ours" autoFocus />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Prix de base (€) *</label>
                      <input type="number" min="0" step="0.5" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Stock global</label>
                      <input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Catégorie</label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={5} className={inputClass} placeholder="Décrivez votre création..." />
                  </div>

                  {/* Image */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-primary" /> Image du produit
                    </label>
                    <div className="flex gap-3 items-start">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted/30 border border-border shrink-0">
                        {form.image
                          ? <Image src={form.image} alt="" fill className="object-cover" unoptimized />
                          : <div className="absolute inset-0 flex items-center justify-center text-muted-foreground"><ImageIcon size={24} /></div>}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={e => {
                            const f = e.target.files?.[0]
                            if (f) handleFileUpload(f)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                        />
                        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} variant="outline" size="sm" className="w-full gap-2">
                          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {uploading ? 'Téléchargement...' : 'Téléverser une image'}
                        </Button>
                        <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className={`${inputClass} text-xs`} placeholder="ou collez une URL d'image" />
                        {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP — max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- VARIANTES (WooCommerce-style) ---- */}
              {tab === 'variants' && (
                <div className="space-y-6">
                  {/* Step 1: Attributes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
                          Attributs
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">Ex: Couleur (Rouge, Bleu) et Taille (40, 45)</p>
                      </div>
                      <Button type="button" onClick={addAttribute} size="sm" variant="outline" className="gap-1.5 shrink-0">
                        <Plus size={14} /> Attribut
                      </Button>
                    </div>

                    {attributes.length === 0 ? (
                      <div className="text-center py-8 bg-secondary/30 rounded-lg">
                        <Palette size={32} className="text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Aucun attribut.</p>
                        <p className="text-xs text-muted-foreground mt-1">Ajoutez « Couleur », « Taille »…</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {attributes.map((attr, aIdx) => (
                          <div key={aIdx} className="border border-border rounded-lg p-3 space-y-2 bg-secondary/10">
                            <div className="flex items-center gap-2">
                              <input
                                value={attr.label}
                                onChange={e => updateAttributeLabel(aIdx, e.target.value)}
                                className={`flex-1 ${smallInputClass}`}
                                placeholder="Nom de l'attribut (ex: Couleur)"
                              />
                              <button type="button" onClick={() => removeAttribute(aIdx)} className="p-1.5 rounded text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors shrink-0">
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {attr.values.map(val => (
                                <span key={val} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                  {val}
                                  <button type="button" onClick={() => removeAttributeValue(aIdx, val)} className="hover:text-red-600">
                                    <X size={12} />
                                  </button>
                                </span>
                              ))}
                              <input
                                className="text-xs px-2 py-1 border border-dashed border-border rounded-full bg-background focus:outline-none focus:ring-1 focus:ring-primary w-28"
                                placeholder="+ valeur, Entrée"
                                onKeyDown={e => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault()
                                    addAttributeValue(aIdx, (e.target as HTMLInputElement).value)
                                    ;(e.target as HTMLInputElement).value = ''
                                  }
                                }}
                                onBlur={e => { addAttributeValue(aIdx, e.target.value); e.target.value = '' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Generate */}
                  {validAttrCount > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
                          Variations ({combos.length})
                        </h3>
                        <Button type="button" onClick={generateMatrix} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shrink-0">
                          <Sparkles size={14} /> Générer les combinaisons
                        </Button>
                      </div>

                      {combos.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/30 rounded-lg">
                          Cliquez sur « Générer les combinaisons » pour créer chaque variation (prix + stock).
                        </p>
                      ) : (
                        <div className="border border-border rounded-lg overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-2 bg-secondary/40 text-xs font-medium text-muted-foreground">
                            <span className="flex-1">Combinaison</span>
                            <span className="w-24">Prix (€)</span>
                            <span className="w-20">Stock</span>
                          </div>
                          <div className="divide-y divide-border max-h-64 overflow-y-auto">
                            {combos.map(combo => (
                              <div key={combo.key} className="flex items-center gap-2 px-3 py-2">
                                <div className="flex-1 flex flex-wrap gap-1">
                                  {Object.entries(combo.options).map(([k, v]) => (
                                    <span key={k} className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                                      <span className="text-muted-foreground">{k}:</span> {v}
                                    </span>
                                  ))}
                                </div>
                                <input
                                  type="number" min="0" step="0.5"
                                  value={combo.price}
                                  onChange={e => updateCombo(combo.key, { price: parseFloat(e.target.value) || 0 })}
                                  className={`w-24 ${smallInputClass}`}
                                />
                                <input
                                  type="number" min="0"
                                  value={combo.stock}
                                  onChange={e => updateCombo(combo.key, { stock: parseInt(e.target.value) || 0 })}
                                  className={`w-20 ${smallInputClass}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {combos.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Astuce : si vous modifiez les attributs, recliquez sur « Générer » — les prix/stock déjà saisis sont conservés.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ---- AVANCÉ ---- */}
              {tab === 'advanced' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} className="w-4 h-4 accent-primary" />
                    <label htmlFor="inStock" className="text-sm text-foreground">
                      <span className="font-medium">En vente</span>
                      <span className="block text-xs text-muted-foreground">Le produit est visible et achetable en boutique</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-amber-500" />
                    <label htmlFor="featured" className="text-sm text-foreground">
                      <span className="font-medium flex items-center gap-1.5">
                        <Star size={14} className="fill-amber-400 text-amber-400" /> Mettre en vedette
                      </span>
                      <span className="block text-xs text-muted-foreground">Affiché sur la page d'accueil (max 6 produits)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
              <Button onClick={handleSave} disabled={!form.name.trim() || form.price <= 0 || saving} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editingId ? 'Mettre à jour' : 'Créer le produit'}
              </Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
