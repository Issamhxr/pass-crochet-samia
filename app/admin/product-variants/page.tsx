'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { products as initialProducts, Product, ProductVariant } from '@/lib/products-data'
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2, Check, X, Palette } from 'lucide-react'

type EditableProducts = Record<string, Product>

export default function ProductVariantsPage() {
  const [prods, setProds] = useState<EditableProducts>({ ...initialProducts })
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // New option form state per variant: key = `${productId}-${variantIdx}`
  const [addingOption, setAddingOption] = useState<string | null>(null)
  const [newOption, setNewOption] = useState({ name: '', value: '', priceModifier: '' })

  // Edit option state
  const [editingOption, setEditingOption] = useState<string | null>(null) // key = `${productId}-${variantIdx}-${optIdx}`
  const [editOption, setEditOption] = useState({ name: '', value: '', priceModifier: '' })

  // Adding new variant
  const [addingVariant, setAddingVariant] = useState<string | null>(null) // productId
  const [newVariant, setNewVariant] = useState({ label: '', type: 'custom' as ProductVariant['type'] })

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const update = (productId: string, variants: ProductVariant[]) => {
    setProds(prev => ({ ...prev, [productId]: { ...prev[productId], variants } }))
    flash()
  }

  const addOption = (productId: string, variantIdx: number) => {
    if (!newOption.name.trim() || !newOption.value.trim()) return
    const product = prods[productId]
    const variants = [...(product.variants || [])]
    const options = [...variants[variantIdx].options, {
      name: newOption.name.trim(),
      value: newOption.value.trim(),
      ...(newOption.priceModifier ? { priceModifier: parseFloat(newOption.priceModifier) } : {}),
    }]
    variants[variantIdx] = { ...variants[variantIdx], options }
    update(productId, variants)
    setAddingOption(null)
    setNewOption({ name: '', value: '', priceModifier: '' })
  }

  const deleteOption = (productId: string, variantIdx: number, optIdx: number) => {
    const variants = [...(prods[productId].variants || [])]
    variants[variantIdx] = { ...variants[variantIdx], options: variants[variantIdx].options.filter((_, i) => i !== optIdx) }
    update(productId, variants)
  }

  const startEditOption = (productId: string, variantIdx: number, optIdx: number) => {
    const opt = prods[productId].variants![variantIdx].options[optIdx]
    setEditOption({ name: opt.name, value: opt.value, priceModifier: opt.priceModifier?.toString() || '' })
    setEditingOption(`${productId}-${variantIdx}-${optIdx}`)
  }

  const confirmEditOption = (productId: string, variantIdx: number, optIdx: number) => {
    const variants = [...(prods[productId].variants || [])]
    const options = [...variants[variantIdx].options]
    options[optIdx] = {
      name: editOption.name.trim(),
      value: editOption.value.trim(),
      ...(editOption.priceModifier ? { priceModifier: parseFloat(editOption.priceModifier) } : {}),
    }
    variants[variantIdx] = { ...variants[variantIdx], options }
    update(productId, variants)
    setEditingOption(null)
  }

  const deleteVariant = (productId: string, variantIdx: number) => {
    if (!confirm('Supprimer cette variante ?')) return
    const variants = (prods[productId].variants || []).filter((_, i) => i !== variantIdx)
    update(productId, variants)
  }

  const addVariant = (productId: string) => {
    if (!newVariant.label.trim()) return
    const variants = [...(prods[productId].variants || []), {
      type: newVariant.type,
      label: newVariant.label.trim(),
      options: [],
    }]
    update(productId, variants)
    setAddingVariant(null)
    setNewVariant({ label: '', type: 'custom' })
  }

  const inputClass = 'px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Variantes</h1>
          <p className="text-muted-foreground text-sm mt-1">Couleurs, tailles et options pour chaque produit</p>
        </div>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Sauvegardé</span>}
      </div>

      {/* Product cards */}
      {Object.values(prods).map((product) => {
        const isExpanded = expanded === product.id
        const variants = product.variants || []

        return (
          <Card key={product.id} className="overflow-hidden">
            {/* Product header */}
            <button
              onClick={() => setExpanded(isExpanded ? null : product.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <Palette size={18} className="text-primary flex-shrink-0" />
                <span className="font-semibold text-foreground">{product.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {variants.length} variante{variants.length !== 1 ? 's' : ''}
                </span>
              </div>
              {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="px-5 pb-5 space-y-4 bg-secondary/10">
                {variants.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucune variante. Ajoutez-en une ci-dessous.</p>
                )}

                {variants.map((variant, variantIdx) => (
                  <div key={variantIdx} className="bg-card rounded-lg border border-border overflow-hidden">
                    {/* Variant header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
                      <div>
                        <span className="font-semibold text-foreground text-sm">{variant.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">({variant.type})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => { setAddingOption(`${product.id}-${variantIdx}`); setEditingOption(null) }}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 px-2 gap-1 text-xs"
                          disabled={addingOption === `${product.id}-${variantIdx}`}
                        >
                          <Plus size={13} /> Option
                        </Button>
                        <button
                          onClick={() => deleteVariant(product.id, variantIdx)}
                          className="p-1 rounded text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="divide-y divide-border/50">
                      {variant.options.map((opt, optIdx) => {
                        const editKey = `${product.id}-${variantIdx}-${optIdx}`
                        return (
                          <div key={optIdx} className="px-4 py-2.5 flex items-center gap-3">
                            {editingOption === editKey ? (
                              <>
                                <input value={editOption.name} onChange={e => setEditOption(p => ({ ...p, name: e.target.value }))}
                                  className={`flex-1 ${inputClass}`} placeholder="Nom" />
                                <input value={editOption.value} onChange={e => setEditOption(p => ({ ...p, value: e.target.value }))}
                                  className={`w-28 ${inputClass}`} placeholder="Valeur" />
                                <input value={editOption.priceModifier} onChange={e => setEditOption(p => ({ ...p, priceModifier: e.target.value }))}
                                  className={`w-20 ${inputClass}`} placeholder="+€" type="number" step="0.5" />
                                <button onClick={() => confirmEditOption(product.id, variantIdx, optIdx)} className="p-1 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={14} /></button>
                                <button onClick={() => setEditingOption(null)} className="p-1 rounded bg-secondary text-foreground hover:bg-secondary/80"><X size={14} /></button>
                              </>
                            ) : (
                              <>
                                <span className="flex-1 text-sm font-medium text-foreground">{opt.name}</span>
                                <span className="text-xs text-muted-foreground w-28 truncate">{opt.value}</span>
                                {opt.priceModifier ? (
                                  <span className="text-xs text-green-600 font-medium w-16 text-right">+{opt.priceModifier}€</span>
                                ) : (
                                  <span className="w-16" />
                                )}
                                <button onClick={() => startEditOption(product.id, variantIdx, optIdx)} className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Edit2 size={13} /></button>
                                <button onClick={() => deleteOption(product.id, variantIdx, optIdx)} className="p-1 rounded text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={13} /></button>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Add option inline form */}
                    {addingOption === `${product.id}-${variantIdx}` && (
                      <div className="px-4 py-3 bg-primary/5 border-t border-border flex items-center gap-2">
                        <input value={newOption.name} onChange={e => setNewOption(p => ({ ...p, name: e.target.value }))}
                          className={`flex-1 ${inputClass}`} placeholder="Nom *" autoFocus />
                        <input value={newOption.value} onChange={e => setNewOption(p => ({ ...p, value: e.target.value }))}
                          className={`w-28 ${inputClass}`} placeholder="Valeur *" />
                        <input value={newOption.priceModifier} onChange={e => setNewOption(p => ({ ...p, priceModifier: e.target.value }))}
                          className={`w-20 ${inputClass}`} placeholder="+€" type="number" step="0.5" />
                        <button onClick={() => addOption(product.id, variantIdx)} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={15} /></button>
                        <button onClick={() => { setAddingOption(null); setNewOption({ name: '', value: '', priceModifier: '' }) }} className="p-1.5 rounded bg-secondary text-foreground"><X size={15} /></button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add new variant */}
                {addingVariant === product.id ? (
                  <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <input value={newVariant.label} onChange={e => setNewVariant(p => ({ ...p, label: e.target.value }))}
                      className={`flex-1 ${inputClass}`} placeholder="Nom de la variante (ex: Couleur)" autoFocus />
                    <select value={newVariant.type} onChange={e => setNewVariant(p => ({ ...p, type: e.target.value as ProductVariant['type'] }))}
                      className={inputClass}>
                      <option value="color">Couleur</option>
                      <option value="size">Taille</option>
                      <option value="material">Matériau</option>
                      <option value="style">Style</option>
                      <option value="custom">Personnalisé</option>
                    </select>
                    <button onClick={() => addVariant(product.id)} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={15} /></button>
                    <button onClick={() => { setAddingVariant(null); setNewVariant({ label: '', type: 'custom' }) }} className="p-1.5 rounded bg-secondary text-foreground"><X size={15} /></button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed gap-2"
                    onClick={() => { setAddingVariant(product.id); setAddingOption(null) }}
                  >
                    <Plus size={15} />
                    Ajouter une variante
                  </Button>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
