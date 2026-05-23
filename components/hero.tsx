import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-secondary to-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center shadow-lg">
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-crochet.jpg"
                alt="Créations au crochet - Amigurumis"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
                Bienvenue chez <span className="text-primary block">Pass-Crochet Samia</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Un univers doux et authentique où chaque création est réalisée à la main, avec passion, patience et amour.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/shop">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold text-base shadow-md hover:shadow-lg transition-all">
                  Voir la boutique
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-primary text-primary hover:bg-primary/10 rounded-full font-semibold text-base"
                >
                  Découvrir mon univers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
