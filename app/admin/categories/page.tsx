'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Edit2, Trash2, Plus, Check, X, Tag, Loader2, ChevronRight, CornerDownRight } from 'lucide-react'

interface Category {
  id: number
  name: string
  parent_id: number | null
  position: number
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // add parent
  const [addingParent, setAddingParent] = useState(false)
  const [newParent, setNewParent] = useState('')

  // add sub (per parent)
  const [addingSubFor, setAddingSubFor] = useState<number | null>(null)
  const [newSub, setNewSub] = useState('')

  // edit
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  const showError = (msg: string) => { setError(msg); setTimeout(() => setError(''), 4000) }

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('id, name, parent_id, position').order('position').order('id')
    if (data) setCats(data as Category[])
    setLoading(false)
  }

  const parents = cats.filter(c => c.parent_id === null)
  const subsOf = (parentId: number) => cats.filter(c => c.parent_id === parentId)

  const addCategory = async (name: string, parentId: number | null) => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (cats.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showError(`« ${trimmed} » existe déjà.`)
      return
    }
    const maxPos = cats.length
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: trimmed, parent_id: parentId, position: maxPos + 1 })
      .select('id, name, parent_id, position')
      .single()
    if (error) {
      showError('Erreur : ' + error.message)
      return
    }
    if (data) setCats(prev => [...prev, data as Category])
    flash()
  }

  const handleDelete = async (cat: Category) => {
    const childCount = subsOf(cat.id).length
    const msg = childCount > 0
      ? `Supprimer « ${cat.name} » et ses ${childCount} sous-catégorie(s) ?`
      : `Supprimer « ${cat.name} » ?`
    if (!confirm(msg)) return
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    if (error) { showError('Erreur : ' + error.message); return }
    // remove the category and any children (DB cascade handles it server-side too)
    setCats(prev => prev.filter(c => c.id !== cat.id && c.parent_id !== cat.id))
    flash()
  }

  const startEdit = (cat: Category) => { setEditingId(cat.id); setEditValue(cat.name) }
  const cancelEdit = () => { setEditingId(null); setEditValue('') }

  const confirmEdit = async (cat: Category) => {
    const trimmed = editValue.trim()
    if (!trimmed) return
    if (trimmed.toLowerCase() !== cat.name.toLowerCase() &&
        cats.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      showError(`« ${trimmed} » existe déjà.`)
      return
    }
    const { error } = await supabase.from('categories').update({ name: trimmed }).eq('id', cat.id)
    if (error) { showError('Erreur : ' + error.message); return }
    setCats(prev => prev.map(c => c.id === cat.id ? { ...c, name: trimmed } : c))
    setEditingId(null)
    flash()
  }

  const inputClass = 'px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm'

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Catégories</h1>
          <p className="text-muted-foreground text-sm mt-1">Catégories et sous-catégories de produits</p>
        </div>
        <Button
          onClick={() => { setAddingParent(true); setEditingId(null) }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          disabled={addingParent}
        >
          <Plus size={16} /> Nouvelle catégorie
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <X size={16} className="shrink-0" /> {error}
        </div>
      )}

      {/* Add parent form */}
      {addingParent && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <p className="text-sm font-semibold text-foreground mb-3">Nouvelle catégorie principale</p>
          <div className="flex gap-2">
            <input
              type="text" value={newParent} onChange={e => setNewParent(e.target.value)}
              placeholder="Nom de la catégorie..." className={`flex-1 ${inputClass}`} autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter') { addCategory(newParent, null); setNewParent(''); setAddingParent(false) }
                if (e.key === 'Escape') setAddingParent(false)
              }}
            />
            <Button onClick={() => { addCategory(newParent, null); setNewParent(''); setAddingParent(false) }} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1">
              <Check size={16} /> Ajouter
            </Button>
            <Button onClick={() => { setAddingParent(false); setNewParent('') }} size="sm" variant="outline">
              <X size={16} />
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            {parents.length} catégorie{parents.length !== 1 ? 's' : ''} principale{parents.length !== 1 ? 's' : ''}
          </span>
          {saved && <span className="text-xs text-green-600 font-medium">✓ Sauvegardé</span>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
        ) : parents.length === 0 ? (
          <div className="text-center py-12">
            <Tag size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucune catégorie. Créez-en une !</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {parents.map(parent => (
              <li key={parent.id} className="px-4 py-2">
                {/* Parent row */}
                <div className="flex items-center gap-3 py-1.5">
                  {editingId === parent.id ? (
                    <>
                      <ChevronRight size={16} className="text-primary shrink-0" />
                      <input value={editValue} onChange={e => setEditValue(e.target.value)} className={`flex-1 ${inputClass}`} autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') confirmEdit(parent); if (e.key === 'Escape') cancelEdit() }} />
                      <button onClick={() => confirmEdit(parent)} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={16} /></button>
                      <button onClick={cancelEdit} className="p-1.5 rounded bg-secondary text-foreground hover:bg-secondary/80"><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <ChevronRight size={16} className="text-primary shrink-0" />
                      <span className="flex-1 font-semibold text-foreground text-sm">{parent.name}</span>
                      <button onClick={() => { setAddingSubFor(parent.id); setNewSub(''); setEditingId(null) }} className="p-1.5 rounded text-muted-foreground hover:bg-secondary hover:text-primary transition-colors" title="Ajouter une sous-catégorie">
                        <Plus size={15} />
                      </button>
                      <button onClick={() => startEdit(parent)} className="p-1.5 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Modifier"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(parent)} className="p-1.5 rounded text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors" title="Supprimer"><Trash2 size={15} /></button>
                    </>
                  )}
                </div>

                {/* Subcategories */}
                {subsOf(parent.id).map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 py-1.5 pl-7">
                    {editingId === sub.id ? (
                      <>
                        <CornerDownRight size={14} className="text-muted-foreground shrink-0" />
                        <input value={editValue} onChange={e => setEditValue(e.target.value)} className={`flex-1 ${inputClass}`} autoFocus
                          onKeyDown={e => { if (e.key === 'Enter') confirmEdit(sub); if (e.key === 'Escape') cancelEdit() }} />
                        <button onClick={() => confirmEdit(sub)} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={15} /></button>
                        <button onClick={cancelEdit} className="p-1.5 rounded bg-secondary text-foreground hover:bg-secondary/80"><X size={15} /></button>
                      </>
                    ) : (
                      <>
                        <CornerDownRight size={14} className="text-muted-foreground shrink-0" />
                        <span className="flex-1 text-foreground text-sm">{sub.name}</span>
                        <button onClick={() => startEdit(sub)} className="p-1.5 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(sub)} className="p-1.5 rounded text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                ))}

                {/* Add subcategory inline form */}
                {addingSubFor === parent.id && (
                  <div className="flex items-center gap-2 py-1.5 pl-7">
                    <CornerDownRight size={14} className="text-muted-foreground shrink-0" />
                    <input
                      value={newSub} onChange={e => setNewSub(e.target.value)} autoFocus
                      placeholder="Nom de la sous-catégorie..." className={`flex-1 ${inputClass}`}
                      onKeyDown={e => {
                        if (e.key === 'Enter') { addCategory(newSub, parent.id); setNewSub(''); setAddingSubFor(null) }
                        if (e.key === 'Escape') setAddingSubFor(null)
                      }}
                    />
                    <button onClick={() => { addCategory(newSub, parent.id); setNewSub(''); setAddingSubFor(null) }} className="p-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={15} /></button>
                    <button onClick={() => { setAddingSubFor(null); setNewSub('') }} className="p-1.5 rounded bg-secondary text-foreground"><X size={15} /></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-muted-foreground">
        Cliquez sur <Plus size={11} className="inline" /> à côté d'une catégorie pour lui ajouter une sous-catégorie.
        Les catégories permettent de filtrer les produits dans la boutique.
      </p>
    </div>
  )
}
