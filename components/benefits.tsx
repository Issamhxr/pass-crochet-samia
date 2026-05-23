import { Heart, Sparkles, Gift, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Benefit {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: Heart,
    title: 'Fait main avec soin',
    description: 'Chaque création est réalisée à la main avec passion et attention au détail'
  },
  {
    icon: Sparkles,
    title: 'Pièces uniques',
    description: 'Des créations originales et personnalisées, aucune n\'est identique'
  },
  {
    icon: Gift,
    title: 'Créations originales',
    description: 'Idéal pour offrir ou se faire plaisir et créer des moments précieux'
  },
  {
    icon: Zap,
    title: 'Artisanal authentique',
    description: 'Le savoir-faire traditionnel du crochet dans chaque pièce créée'
  },
]

export function Benefits() {
  return (
    <section className="w-full py-16 md:py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-14">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground">
              Pourquoi choisir mes créations ?
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card 
                  key={index}
                  className="p-8 bg-card border-border/50 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-5">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
