'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { supabase, type DbOrder } from '@/lib/supabase'
import { DollarSign, Users, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react'

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

export default function AnalyticsAdmin() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: true })
    if (data) setOrders(data as DbOrder[])
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 size={32} className="animate-spin text-primary" /></div>
  }

  const valid = orders.filter(o => o.status !== 'cancelled')
  const totalRevenue = valid.reduce((s, o) => s + Number(o.total), 0)
  const totalOrders = valid.length
  const uniqueCustomers = new Set(valid.map(o => o.customer_email.toLowerCase())).size
  const avgBasket = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Last 6 months breakdown
  const now = new Date()
  const monthsData: { label: string; revenue: number; orders: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthOrders = valid.filter(o => {
      const od = new Date(o.created_at)
      return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth()
    })
    monthsData.push({
      label: MONTHS[d.getMonth()],
      revenue: monthOrders.reduce((s, o) => s + Number(o.total), 0),
      orders: monthOrders.length,
    })
  }
  const maxRevenue = Math.max(1, ...monthsData.map(d => d.revenue))
  const maxOrders = Math.max(1, ...monthsData.map(d => d.orders))

  // Top categories from order items
  const catCount: Record<string, number> = {}
  valid.forEach(o => o.items?.forEach(it => {
    const c = it.category || 'Autre'
    catCount[c] = (catCount[c] || 0) + it.quantity
  }))
  const totalItems = Object.values(catCount).reduce((s, n) => s + n, 0)
  const topCategories = Object.entries(catCount)
    .map(([category, count]) => ({ category, percentage: totalItems ? Math.round((count / totalItems) * 100) : 0 }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)

  const metrics = [
    { title: 'Revenu total', value: `${totalRevenue.toFixed(2)}€`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { title: 'Clients uniques', value: String(uniqueCustomers), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Commandes', value: String(totalOrders), icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
    { title: 'Panier moyen', value: `${avgBasket.toFixed(2)}€`, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Statistiques</h1>
        <p className="text-muted-foreground">Données réelles basées sur vos commandes</p>
      </div>

      {orders.length === 0 && (
        <Card className="p-8 text-center">
          <ShoppingCart size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucune commande encore. Les statistiques apparaîtront ici dès la première vente.</p>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{m.title}</h3>
                <div className={`p-2 rounded-lg ${m.color}`}><Icon size={20} /></div>
              </div>
              <p className="text-3xl font-bold text-foreground">{m.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Revenus (6 derniers mois)</h2>
          <div className="space-y-4">
            {monthsData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{data.label}</span>
                  <span className="text-sm font-semibold text-primary">{data.revenue.toFixed(2)}€</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${(data.revenue / maxRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Commandes (6 derniers mois)</h2>
          <div className="space-y-4">
            {monthsData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{data.label}</span>
                  <span className="text-sm font-semibold text-accent">{data.orders} commande(s)</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div className="bg-accent h-full rounded-full transition-all duration-300" style={{ width: `${(data.orders / maxOrders) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {topCategories.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Catégories populaires</h2>
          <div className="space-y-4">
            {topCategories.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.category}</span>
                  <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="bg-linear-to-r from-primary to-accent h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
