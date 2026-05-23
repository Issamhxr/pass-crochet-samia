'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from 'lucide-react'

export default function AnalyticsAdmin() {
  const metrics = [
    {
      title: 'Revenus mensuels',
      value: '2.450€',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      title: 'Clients actifs',
      value: '82',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Commandes',
      value: '24',
      change: '+5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Taux de conversion',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ]

  const chartData = [
    { month: 'Jan', revenue: 1200, orders: 12 },
    { month: 'Fév', revenue: 1450, orders: 15 },
    { month: 'Mar', revenue: 1800, orders: 18 },
    { month: 'Avr', revenue: 2100, orders: 22 },
    { month: 'Mai', revenue: 2450, orders: 24 },
  ]

  const maxRevenue = Math.max(...chartData.map(d => d.revenue))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Statistiques</h1>
        <p className="text-muted-foreground">Analyse de votre activité commerciale</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
          const trendColor = metric.trend === 'up' ? 'text-green-600' : 'text-red-600'

          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <p className="text-3xl font-bold text-foreground mb-2">{metric.value}</p>

              <div className="flex items-center gap-2">
                <TrendIcon size={16} className={trendColor} />
                <span className={`text-sm font-medium ${trendColor}`}>{metric.change}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Revenus mensuels</h2>

          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{data.month}</span>
                  <span className="text-sm font-semibold text-primary">{data.revenue}€</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Orders Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-6">Commandes mensuelles</h2>

          <div className="space-y-4">
            {chartData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{data.month}</span>
                  <span className="text-sm font-semibold text-accent">{data.orders} commandes</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-300"
                    style={{ width: `${(data.orders / 24) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-serif font-bold text-foreground mb-6">Aperçu client</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Clients totaux</p>
            <p className="text-3xl font-bold text-foreground">347</p>
            <p className="text-xs text-green-600 mt-2">+12 ce mois</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Clients réguliers</p>
            <p className="text-3xl font-bold text-foreground">82</p>
            <p className="text-xs text-muted-foreground mt-2">23,6% du total</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Panier moyen</p>
            <p className="text-3xl font-bold text-foreground">102€</p>
            <p className="text-xs text-blue-600 mt-2">+8% vs dernier mois</p>
          </div>
        </div>
      </Card>

      {/* Top Categories */}
      <Card className="p-6">
        <h2 className="text-xl font-serif font-bold text-foreground mb-6">Catégories populaires</h2>

        <div className="space-y-4">
          {[
            { category: 'Amigurumis', percentage: 35 },
            { category: 'Sacs en Granny', percentage: 28 },
            { category: 'Accessoires', percentage: 22 },
            { category: 'Petites créations', percentage: 15 },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{item.category}</span>
                <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
