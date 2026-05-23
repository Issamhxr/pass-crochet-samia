import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Marie',
    role: 'Client depuis 2023',
    content: 'Les amigurumis de Samia sont magnifiques ! Chaque création est unique et faite avec tellement de soin. Je recommande vivement !',
    rating: 5
  },
  {
    name: 'Sophie',
    role: 'Cadeau pour ma fille',
    content: 'Absolument parfait ! Le sac en granny est de très bonne qualité et les couleurs sont exactement comme sur la photo. Ma fille l\'adore.',
    rating: 5
  },
  {
    name: 'Émilie',
    role: 'Participante à un atelier',
    content: 'L\'atelier avec Samia était une expérience apaisante et inspirante. Elle est très pédagogue et bienveillante. À refaire !',
    rating: 5
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < rating ? 'fill-accent text-accent' : 'text-muted-foreground'}
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="w-full py-16 md:py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-14">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground">
              Avis de nos clients
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce que nos clients pensent de nos créations
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-8 bg-card hover:shadow-lg transition-shadow border-border/50"
              >
                <div className="space-y-4">
                  {/* Rating */}
                  <StarRating rating={testimonial.rating} />

                  {/* Content */}
                  <p className="text-muted-foreground leading-relaxed italic">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Author */}
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
