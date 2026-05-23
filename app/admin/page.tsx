'use client'

import { Card } from '@/components/ui/card'
import { ShoppingCart, Package, Users, TrendingUp, Calendar, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  // Mock data - in production this would come from a database
  const stats = [
    { label: 'Commandes ce mois', value: '24', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Produits en stock', value: '156', icon: Package, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Clients actifs', value: '82', icon: Users, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Revenus ce mois', value: '2.450€', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  ]

  const recentOrders = [
    { id: '001', customer: 'Marie D.', amount: '85.50€', status: 'Livré', date: '2 jours ago' },
    { id: '002', customer: 'Sophie L.', amount: '42.00€', status: 'En cours', date: '1 jour ago' },
    { id: '003', customer: 'Emma T.', amount: '156.80€', status: 'En attente', date: 'Aujourd\'hui' },
    { id: '004', customer: 'Julie M.', amount: '68.50€', status: 'Livré', date: 'Aujourd\'hui' },
  ]

  const topProducts = [
    { name: 'Amigurumi Ours', sales: 45, revenue: '1.575€' },
    { name: 'Sac à Main Granny', sales: 32, revenue: '1.760€' },
    { name: 'Amigurumi Chat', sales: 28, revenue: '1.120€' },
    { name: 'Pochette Rose', sales: 24, revenue: '672€' },
  ]

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

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-foreground">Commande #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.amount}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium inline-block mt-1 ${
                    order.status === 'Livré' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    order.status === 'En cours' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
              <p className="text-3xl font-bold text-foreground">2.450€</p>
              <p className="text-xs text-green-600 mt-1">+12% par rapport au mois dernier</p>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Ce trimestre</p>
              <p className="text-2xl font-bold text-foreground">7.820€</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="text-xl font-serif font-bold text-foreground mb-6">Produits les plus vendus</h2>

        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-foreground">{product.name}</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Ventes</p>
                  <p className="font-semibold text-foreground">{product.sales}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Revenu</p>
                  <p className="font-semibold text-primary">{product.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
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
