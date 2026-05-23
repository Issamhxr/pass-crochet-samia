'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { products as initialData, CATEGORIES } from '@/lib/products-data'
import { Plus, Edit, Trash2, Search, X, Check, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  stock: number
  inStock: boolean
  description: string
}

const toList = (data: typeof initialData): Product[] =>
  Object.values(data).map(p => ({
    id: p.id, name: p.name, category: p.category,
    price: p.price, image: p.image, stock: p.stock,
    inStock: p.inStock, description: p.description,
  }))

const blank: Omit<Product, 'id'> = {
  name: '', category: CATEGORIES[0], price: 0,
  image: '/images/product-1.jpg', stock: 0,
  inStock: true, description: '',
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>(toList(initialData))
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(blank)
  const [saved, setSaved] = useState(false)

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm({ ...blank })
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setForm({ name: p.name, category: p.category, price: p.price, image: p.image, stock: p.stock, inStock: p.inStock, description: p.description })
    setEditingId(p.id)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    setProducts(products.filter(p => p.id !== id))
    flash()
  }

  const handleSave = () => {
    if (!form.name.trim() || form.price <= 0) return
    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? { ...form, id: editingId } : p))
    } else {
      const newId = String(Date.now())
      setProducts([...products, { ...form, id: newId }])
    }
    setModalOpen(false)
    flash()
  }

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search */}
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{products.length}</p>
          <p className="text-xs text-muted-foreground">Total produits</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{products.filter(p => p.inStock).length}</p>
          <p className="text-xs text-muted-foreground">En stock</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{products.reduce((s, p) => s + p.stock, 0)}</p>
          <p className="text-xs text-muted-foreground">Unités totales</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
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
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-foreground">{product.name}</span>
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
      </Card>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingId ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded hover:bg-secondary"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nom *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="Nom du produit" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Prix (€) *</label>
                  <input type="number" min="0" step="0.5" value={form.price} onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Catégorie</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className={inputClass} placeholder="Description du produit..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Image (chemin)</label>
                <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className={inputClass} placeholder="/images/product-1.jpg" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm(p => ({ ...p, inStock: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <label htmlFor="inStock" className="text-sm text-foreground">En vente (visible en boutique)</label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={!form.name.trim() || form.price <= 0} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Check size={16} /> {editingId ? 'Mettre à jour' : 'Créer le produit'}
              </Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
