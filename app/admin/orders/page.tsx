'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase, type DbOrder } from '@/lib/supabase'
import { Search, ChevronDown, Loader2, Package, X } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En traitement',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé',
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [detail, setDetail] = useState<DbOrder | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data as DbOrder[])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: status as DbOrder['status'] } : o))
      setDetail(d => d && d.id === id ? { ...d, status: status as DbOrder['status'] } : d)
    }
  }

  const filtered = orders.filter(o => {
    const s = searchTerm.toLowerCase()
    const matches = o.customer_name.toLowerCase().includes(s) ||
      o.customer_email.toLowerCase().includes(s) ||
      o.order_number.toLowerCase().includes(s)
    const statusOk = filterStatus === 'all' || o.status === filterStatus
    return matches && statusOk
  })

  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Gestion des commandes</h1>
        <p className="text-muted-foreground">Suivi et gestion de toutes les commandes clients</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Commandes totales</p>
          <p className="text-3xl font-bold text-foreground">{orders.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Livrées</p>
          <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Revenu total</p>
          <p className="text-3xl font-bold text-primary">{revenue.toFixed(2)}€</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-4 py-2">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou n° de commande..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {orders.length === 0 ? 'Aucune commande pour le moment.' : 'Aucune commande trouvée.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Commande</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Client</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground hidden md:table-cell">Articles</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Total</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Statut</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground hidden lg:table-cell">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4"><p className="font-semibold text-primary">#{order.order_number}</p></td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-foreground hidden md:table-cell">{order.items?.length ?? 0} article(s)</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{Number(order.total).toFixed(2)}€</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${STATUS_STYLES[order.status]}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm hidden lg:table-cell">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline" className="text-sm" onClick={() => setDetail(order)}>Voir détails</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetail(null)}>
          <Card className="w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Commande #{detail.order_number}</h2>
              <button onClick={() => setDetail(null)} className="p-1 rounded hover:bg-secondary"><X size={18} /></button>
            </div>

            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">Client :</span> <span className="font-medium text-foreground">{detail.customer_name}</span></p>
              <p><span className="text-muted-foreground">Email :</span> {detail.customer_email}</p>
              {detail.customer_phone && <p><span className="text-muted-foreground">Téléphone :</span> {detail.customer_phone}</p>}
              {detail.shipping_address && (
                <p><span className="text-muted-foreground">Adresse :</span> {detail.shipping_address.address}, {detail.shipping_address.zipCode} {detail.shipping_address.city}, {detail.shipping_address.country}</p>
              )}
              {detail.paypal_transaction_id && <p><span className="text-muted-foreground">PayPal :</span> {detail.paypal_transaction_id}</p>}
              <p><span className="text-muted-foreground">Date :</span> {new Date(detail.created_at).toLocaleString('fr-FR')}</p>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">Articles</p>
              {detail.items?.map((it, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-foreground">{it.name} <span className="text-muted-foreground">× {it.quantity}</span></span>
                  <span className="font-medium">{(it.price * it.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{Number(detail.subtotal).toFixed(2)}€</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">TVA</span><span>{Number(detail.tax).toFixed(2)}€</span></div>
              <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">{Number(detail.total).toFixed(2)}€</span></div>
            </div>

            <div className="border-t border-border pt-3">
              <label className="text-sm font-medium text-foreground block mb-2">Statut de la commande</label>
              <select
                value={detail.status}
                onChange={e => updateStatus(detail.id, e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
