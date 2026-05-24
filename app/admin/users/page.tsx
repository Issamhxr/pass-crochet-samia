'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Users, Plus, Edit2, Check, X, Loader2, Shield, ShoppingBag, User, Trash2 } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'client' | 'vendeur'
  status: string
  created_at: string
}

const ROLES = ['client', 'vendeur', 'admin'] as const
const roleLabels: Record<string, string> = { admin: 'Admin', client: 'Client', vendeur: 'Vendeur' }
const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  vendeur: 'bg-blue-100 text-blue-700',
  client: 'bg-green-100 text-green-700',
}
const RoleIcon = ({ role }: { role: string }) => {
  if (role === 'admin') return <Shield size={12} />
  if (role === 'vendeur') return <ShoppingBag size={12} />
  return <User size={12} />
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<string>('client')
  const [saved, setSaved] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'client' })
  const [createError, setCreateError] = useState('')

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  useEffect(() => { loadProfiles() }, [])

  async function loadProfiles() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setProfiles(data as Profile[])
    setLoading(false)
  }

  const startEditRole = (p: Profile) => {
    setEditingId(p.id)
    setEditRole(p.role)
  }

  const confirmEditRole = async (id: string) => {
    const { error } = await supabase.from('profiles').update({ role: editRole }).eq('id', id)
    if (!error) {
      setProfiles(profiles.map(p => p.id === id ? { ...p, role: editRole as Profile['role'] } : p))
      flash()
    }
    setEditingId(null)
  }

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.full_name) return
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setModalOpen(false)
        setForm({ email: '', password: '', full_name: '', role: 'client' })
        setTimeout(loadProfiles, 1000)
        flash()
      } else {
        setCreateError(data.error || 'Erreur lors de la création')
      }
    } catch {
      setCreateError('Erreur de connexion')
    }
    setCreating(false)
  }

  const inputClass = 'w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Utilisateurs</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez les clients, vendeurs et administrateurs</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Sauvegardé</span>}
          <Button onClick={() => setModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus size={16} /> Créer un utilisateur
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map(role => (
          <Card key={role} className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{profiles.filter(p => p.role === role).length}</p>
            <p className="text-xs text-muted-foreground">{roleLabels[role]}s</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-muted-foreground" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16">
            <Users size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Utilisateur</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden sm:table-cell">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Rôle</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground hidden md:table-cell">Inscrit le</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {(p.full_name || p.email || '?')[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{p.full_name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{p.email}</td>
                    <td className="px-5 py-3">
                      {editingId === p.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={e => setEditRole(e.target.value)}
                            className="text-xs border border-border rounded px-2 py-1 bg-background text-foreground"
                          >
                            {ROLES.map(r => <option key={r} value={r}>{roleLabels[r]}</option>)}
                          </select>
                          <button onClick={() => confirmEditRole(p.id)} className="p-1 rounded bg-green-100 text-green-700 hover:bg-green-200"><Check size={13} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1 rounded bg-secondary text-foreground hover:bg-secondary/80"><X size={13} /></button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[p.role]}`}>
                          <RoleIcon role={p.role} />
                          {roleLabels[p.role]}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs hidden md:table-cell">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3">
                      {editingId !== p.id && (
                        <button onClick={() => startEditRole(p)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Créer un utilisateur</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded hover:bg-secondary"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nom complet *</label>
                <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className={inputClass} placeholder="Prénom Nom" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Mot de passe *</label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inputClass} placeholder="Minimum 6 caractères" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Rôle</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={inputClass}>
                  <option value="client">Client</option>
                  <option value="vendeur">Vendeur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            {createError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {createError}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Un email de confirmation sera envoyé. Désactivez la confirmation email dans Supabase Auth → Providers → Email si vous souhaitez que le compte soit actif immédiatement.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleCreate}
                disabled={!form.email || !form.password || !form.full_name || creating}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Créer
              </Button>
              <Button onClick={() => setModalOpen(false)} variant="outline" className="flex-1">Annuler</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
