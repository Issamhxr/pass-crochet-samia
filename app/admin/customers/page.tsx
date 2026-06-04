'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { supabase, type DbOrder } from '@/lib/supabase'
import { Search, Mail, Phone, Loader2, Users } from 'lucide-react'

interface Customer {
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  firstOrder: string
  registered: boolean
}

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [{ data: orders }, { data: profiles }] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: true }),
      supabase.from('profiles').select('email, full_name, role'),
    ])

    const registeredEmails = new Set((profiles || []).map((p: any) => (p.email || '').toLowerCase()))
    const map = new Map<string, Customer>()

    ;(orders as DbOrder[] | null)?.forEach(o => {
      const key = o.customer_email.toLowerCase()
      if (!key) return
      const existing = map.get(key)
      if (existing) {
        existing.orders += 1
        existing.totalSpent += Number(o.total)
        if (!existing.phone && o.customer_phone) existing.phone = o.customer_phone
      } else {
        map.set(key, {
          name: o.customer_name,
          email: o.customer_email,
          phone: o.customer_phone || '',
          orders: 1,
          totalSpent: Number(o.total),
          firstOrder: o.created_at,
          registered: registeredEmails.has(key),
        })
      }
    })

    // Add registered users who haven't ordered yet
    ;(profiles || []).forEach((p: any) => {
      const key = (p.email || '').toLowerCase()
      if (key && !map.has(key) && p.role !== 'admin') {
        map.set(key, {
          name: p.full_name || p.email,
          email: p.email,
          phone: '',
          orders: 0,
          totalSpent: 0,
          firstOrder: '',
          registered: true,
        })
      }
    })

    setCustomers(Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent))
    setLoading(false)
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)
  const totalOrders = customers.reduce((s, c) => s + c.orders, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Gestion des clients</h1>
        <p className="text-muted-foreground">Clients issus des commandes et des comptes inscrits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Clients</p>
          <p className="text-3xl font-bold text-foreground">{customers.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Inscrits</p>
          <p className="text-3xl font-bold text-blue-600">{customers.filter(c => c.registered).length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Commandes</p>
          <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Revenu client</p>
          <p className="text-3xl font-bold text-primary">{totalRevenue.toFixed(2)}€</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-0 focus:outline-none text-foreground placeholder-muted-foreground"
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={28} className="animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Users size={40} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun client pour le moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(customer => (
            <Card key={customer.email} className="p-6 hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-5 gap-6 items-center">
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium inline-block mt-2 ${
                    customer.registered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.registered ? 'Compte inscrit' : 'Invité'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                    <Mail size={16} className="text-muted-foreground" />
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Phone size={16} className="text-muted-foreground" />
                      {customer.phone}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Commandes</p>
                  <p className="text-2xl font-bold text-foreground">{customer.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dépensé</p>
                  <p className="text-2xl font-bold text-primary">{customer.totalSpent.toFixed(2)}€</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {customer.firstOrder
                    ? `Client depuis ${new Date(customer.firstOrder).toLocaleDateString('fr-FR')}`
                    : 'Pas encore de commande'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
