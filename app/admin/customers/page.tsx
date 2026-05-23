'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Mail, Phone, MapPin, MoreVertical } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  joinDate: string
  status: 'active' | 'inactive'
}

export default function CustomersAdmin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [customers] = useState<Customer[]>([
    { id: '1', name: 'Marie Dupont', email: 'marie@example.com', phone: '+33 6 12 34 56 78', orders: 5, totalSpent: 285.50, joinDate: '2024-01-15', status: 'active' },
    { id: '2', name: 'Sophie Laurent', email: 'sophie@example.com', phone: '+33 6 23 45 67 89', orders: 3, totalSpent: 142.00, joinDate: '2024-02-20', status: 'active' },
    { id: '3', name: 'Emma Thibault', email: 'emma@example.com', phone: '+33 6 34 56 78 90', orders: 8, totalSpent: 456.80, joinDate: '2024-01-05', status: 'active' },
    { id: '4', name: 'Julie Martin', email: 'julie@example.com', phone: '+33 6 45 67 89 01', orders: 2, totalSpent: 68.50, joinDate: '2024-03-10', status: 'active' },
    { id: '5', name: 'Alice Bernard', email: 'alice@example.com', phone: '+33 6 56 78 90 12', orders: 4, totalSpent: 198.30, joinDate: '2024-02-28', status: 'inactive' },
    { id: '6', name: 'Claire Moreau', email: 'claire@example.com', phone: '+33 6 67 89 01 23', orders: 7, totalSpent: 387.50, joinDate: '2023-12-20', status: 'active' },
  ])

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Gestion des clients</h1>
        <p className="text-muted-foreground">Suivi de votre base client</p>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-0 focus:outline-none text-foreground placeholder-muted-foreground"
          />
        </div>
      </Card>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-5 gap-6 items-center">
              {/* Name & Status */}
              <div>
                <p className="font-semibold text-foreground">{customer.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium inline-block mt-2 ${
                  customer.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {customer.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>

              {/* Contact Info */}
              <div>
                <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                  <Mail size={16} className="text-muted-foreground" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone size={16} className="text-muted-foreground" />
                  {customer.phone}
                </div>
              </div>

              {/* Stats */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Commandes</p>
                <p className="text-2xl font-bold text-foreground">{customer.orders}</p>
              </div>

              {/* Total Spent */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dépensé</p>
                <p className="text-2xl font-bold text-primary">{customer.totalSpent.toFixed(2)}€</p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" className="text-sm">
                  Détails
                </Button>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <MoreVertical size={18} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Member Since */}
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              Membre depuis: {customer.joinDate}
            </div>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Aucun client trouvé</p>
        </Card>
      )}

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Clients totaux</p>
          <p className="text-3xl font-bold text-foreground">{customers.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Clients actifs</p>
          <p className="text-3xl font-bold text-foreground">{customers.filter(c => c.status === 'active').length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total commandes</p>
          <p className="text-3xl font-bold text-foreground">{customers.reduce((sum, c) => sum + c.orders, 0)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Revenu client</p>
          <p className="text-3xl font-bold text-primary">{customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}€</p>
        </Card>
      </div>
    </div>
  )
}
