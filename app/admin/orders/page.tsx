'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown } from 'lucide-react'

interface Order {
  id: string
  customer: string
  email: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
}

export default function OrdersAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [orders, setOrders] = useState<Order[]>([
    { id: '001', customer: 'Marie Dupont', email: 'marie@example.com', items: 2, total: 85.50, status: 'delivered', date: '2024-05-03' },
    { id: '002', customer: 'Sophie Laurent', email: 'sophie@example.com', items: 1, total: 42.00, status: 'shipped', date: '2024-05-02' },
    { id: '003', customer: 'Emma Thibault', email: 'emma@example.com', items: 3, total: 156.80, status: 'processing', date: '2024-05-01' },
    { id: '004', customer: 'Julie Martin', email: 'julie@example.com', items: 1, total: 68.50, status: 'delivered', date: '2024-04-30' },
    { id: '005', customer: 'Alice Bernard', email: 'alice@example.com', items: 2, total: 98.30, status: 'pending', date: '2024-04-29' },
    { id: '006', customer: 'Claire Moreau', email: 'claire@example.com', items: 4, total: 187.50, status: 'processing', date: '2024-04-28' },
  ])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    }
    
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Gestion des commandes</h1>
        <p className="text-muted-foreground">Suivi et gestion de toutes les commandes clients</p>
      </div>

      {/* Filters */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 border border-border rounded-lg px-4 py-2">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom ou numéro de commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:outline-none text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="shipped">Expédié</option>
              <option value="delivered">Livré</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Commande</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Client</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Articles</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Total</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Statut</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary">#{order.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{order.items} articles</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{order.total.toFixed(2)}€</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{order.date}</td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" className="text-sm">
                      Voir détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune commande trouvée</p>
          </div>
        )}
      </Card>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Commandes totales</p>
          <p className="text-3xl font-bold text-foreground">{orders.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">En attente</p>
          <p className="text-3xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">En traitement</p>
          <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'processing').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Revenu total</p>
          <p className="text-3xl font-bold text-green-600">{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}€</p>
        </Card>
      </div>
    </div>
  )
}
