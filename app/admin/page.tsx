'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { supabase, type DbOrder } from '@/lib/supabase'
import {
  ShoppingCart, Package, Users, TrendingUp, Calendar, DollarSign, Loader2,
} from 'lucide-react'

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

function relativeDate(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return d.toLocaleDateString('fr-FR')
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [productCount, setProductCount] = useState(0)
  const [stockUnits, setStockUnits] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [{ data: ords }, { data: prods }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('stock'),
    ])
    if (ords) setOrders(ords as DbOrder[])
    if (prods) {
      setProductCount(prods.length)
      setStockUnits(prods.reduce((s: number, p: any) => s + (p.stock || 0), 0))
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 size={32} className="animate-spin text-primary" /></div>
  }

  const now = new Date()
  const valid = orders.filter(o => o.status !== 'cancelled')

  const thisMonth = valid.filter(o => {
    const d = new Date(o.created_at)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = valid.filter(o => {
    const d = new Date(o.created_at)
    return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth()
  })

  const monthRevenue = thisMonth.reduce((s, o) => s + Number(o.total), 0)
  const lastMonthRevenue = lastMonth.reduce((s, o) => s + Number(o.total), 0)
  const revenueChange = lastMonthRevenue > 0
    ? Math.round(((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : null

  // Current quarter revenue
  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3
  const quarterRevenue = valid.filter(o => {
    const d = new Date(o.created_at)
    return d.getFullYear() === now.getFullYear() && d.getMonth() >= quarterStartMonth
  }).reduce((s, o) => s + Number(o.total), 0)

  const activeCustomers = new Set(valid.map(o => o.customer_email.toLowerCase())).size

  const stats = [
    { label: 'Commandes ce mois', value: String(thisMonth.length), icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Produits en stock', value: String(stockUnits), icon: Package, color: 'bg-green-100 text-green-600' },
    { label: 'Clients', value: String(activeCustomers), icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Revenus ce mois', value: `${monthRevenue.toFixed(2)}€`, icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
  ]

  const recentOrders = orders.slice(0, 5)

  // Top products by units sold (from order items)
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {}
  valid.forEach(o => o.items?.forEach(it => {
    const key = it.name
    if (!productSales[key]) productSales[key] = { name: it.name, sales: 0, revenue: 0 }
    productSales[key].sales += it.quantity
    productSales[key].revenue += it.price * it.quantity
  }))
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-foreground">Commandes récentes</h2>
            <Calendar className="text-muted-foreground" size={20} />
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart size={36} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">#{order.order_number}</p>
                    <p className="text-sm text-muted-foreground truncate">{order.customer_name} · {relativeDate(order.created_at)}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-semibold text-foreground">{Number(order.total).toFixed(2)}€</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium inline-block mt-1 ${STATUS_STYLES[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Revenue Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-foreground">Revenus</h2>
            <TrendingUp className="text-green-600" size={20} />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ce mois</p>
              <p className="text-3xl font-bold text-foreground">{monthRevenue.toFixed(2)}€</p>
              {revenueChange !== null && (
                <p className={`text-xs mt-1 ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueChange >= 0 ? '+' : ''}{revenueChange}% par rapport au mois dernier
                </p>
              )}
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Ce trimestre</p>
              <p className="text-2xl font-bold text-foreground">{quarterRevenue.toFixed(2)}€</p>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Total (toutes commandes)</p>
              <p className="text-2xl font-bold text-primary">
                {valid.reduce((s, o) => s + Number(o.total), 0).toFixed(2)}€
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="text-xl font-serif font-bold text-foreground mb-6">Produits les plus vendus</h2>

        {topProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package size={36} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune vente enregistrée pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.name}</p>
                </div>
                <div className="flex items-center gap-8 shrink-0">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Ventes</p>
                    <p className="font-semibold text-foreground">{product.sales}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Revenu</p>
                    <p className="font-semibold text-primary">{product.revenue.toFixed(2)}€</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-linear-to-r from-primary/10 to-accent/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">Gestion rapide</h3>
            <p className="text-sm text-muted-foreground">Accédez à vos outils d'administration</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin/products" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Voir les produits
            </a>
            <a href="/admin/orders" className="px-6 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
              Gérer les commandes
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
