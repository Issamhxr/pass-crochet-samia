'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Edit2, Trash2, Plus, Check, X, Tag, Loader2 } from 'lucide-react'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('name').order('position').order('id')
    if (data) setCategories(data.map(r => r.name))
    setLoading(false)
  }

  const handleAdd = async () => {
    const trimmed = newCategory.trim()
    if (!trimmed || categories.includes(trimmed)) return
    const maxPos = categories.length
    const { error } = await supabase.from('categories').insert({ name: trimmed, position: maxPos + 1 })
    if (!error) {
      setCategories([...categories, trimmed])
      setNewCategory('')
      setAdding(false)
      flash()
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm(`Supprimer la catégorie "${categories[index]}" ?`)) return
    const { error } = await supabase.from('categories').delete().eq('name', categories[index])
    if (!error) {
      setCategories(categories.filter((_, i) => i !== index))
      flash()
    }
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(categories[index])
  }

  const confirmEdit = async () => {
    if (editingIndex === null) return
    const trimmed = editValue.trim()
    if (!trimmed || (trimmed !== categories[editingIndex] && categories.includes(trimmed))) return
    const { error } = await supabase.from('categories')
      .update({ name: trimmed })
      .eq('name', categories[editingIndex])
    if (!error) {
      const updated = [...categories]
      updated[editingIndex] = trimmed
      setCategories(updated)
      setEditingIndex(null)
      flash()
    }
  }

  const cancelEdit = () => { setEditingIndex(null); setEditValue('') }

  const inputClass = 'px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm'

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Catégories</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez les catégories de produits</p>
        </div>
        <Button
          onClick={() => { setAdding(true); setEditingIndex(null) }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          disabled={adding}
        >
          <Plus size={16} />
          Nouvelle catégorie
        </Button>
      </div>

      {adding && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <p className="text-sm font-semibold text-foreground mb-3">Nouvelle catégorie</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nom de la catégorie..."
              className={`flex-1 ${inputClass}`}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
            />
            <Button onClick={handleAdd} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
              <Check size={16} /> Ajouter
            </Button>
            <Button onClick={() => { setAdding(false); setNewCategory('') }} size="sm" variant="outline">
              <X size={16} />
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
          </span>
          {saved && <span className="text-xs text-green-600 font-medium">✓ Sauvegardé</span>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <Tag size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucune catégorie. Créez-en une !</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((category, index) => (
              <li key={index} className="flex items-center gap-3 px-6 py-3 hover:bg-secondary/20 transition-colors">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={`flex-1 ${inputClass}`}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') confirmEdit(); if (e.key === 'Escape') cancelEdit() }}
                    />
                    <button onClick={confirmEdit} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={cancelEdit} className="p-1.5 rounded bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="flex-1 font-medium text-foreground text-sm">{category}</span>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(index)} className="p-1.5 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(index)} className="p-1.5 rounded text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Les catégories permettent de filtrer les produits dans la boutique.
      </p>
    </div>
  )
}
