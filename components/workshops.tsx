import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { BookOpen, Users, Lightbulb } from 'lucide-react'

export function Workshops() {
  return (
    <section id="workshops" className="w-full py-16 md:py-28 bg-gradient-to-b from-accent/10 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center shadow-lg">
            <div className="relative w-full h-full">
              <Image
                src="/images/workshop-crochet.jpg"
                alt="Atelier crochet - Apprendre ensemble"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground text-balance">
                Ateliers crochet
              </h2>
              <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Vous souhaitez apprendre le crochet ? Je propose des ateliers pour débutantes et passionnées afin de vous transmettre cet art dans une ambiance conviviale et détendue.
            </p>

            {/* Features */}
            <div className="space-y-5 pt-4">
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Apprendre</h3>
                  <p className="text-muted-foreground">Découvrez les bases et les techniques du crochet</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Créer</h3>
                  <p className="text-muted-foreground">Réalisez vos propres créations uniques</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Se détendre</h3>
                  <p className="text-muted-foreground">Une ambiance conviviale et relaxante</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold shadow-md hover:shadow-lg transition-all">
                Réserver un atelier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
