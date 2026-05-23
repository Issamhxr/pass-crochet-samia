import Image from 'next/image'

export function Universe() {
  return (
    <section className="w-full py-16 md:py-28 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 md:grid-cols-2 items-center">
          {/* Image */}
          <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden bg-muted/30 flex items-center justify-center shadow-lg order-last md:order-first">
            <div className="relative w-full h-full">
              <Image
                src="/images/about-crochet.jpg"
                alt="Univers doux et authentique du crochet"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-first md:order-last">
            <div>
              <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground text-balance">
                Mon univers
              </h2>
              <div className="w-20 h-1 bg-primary mt-4 rounded-full"></div>
            </div>
            
            <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
              <p>
                Depuis mon enfance, le crochet est bien plus qu&apos;un simple loisir…
              </p>
              <p>
                C&apos;est un moyen d&apos;expression, un moment de calme et une véritable passion.
              </p>
              <p>
                Aujourd&apos;hui, à travers Pass-Crochet Samia, je partage des créations uniques inspirées par la douceur, l&apos;enfance et le fait main.
              </p>
            </div>

            <div className="pt-2 border-l-4 border-primary pl-6">
              <p className="italic text-primary font-semibold text-lg">
                Chaque création porte une part de mon histoire, de ma passion et de mon amour pour le fait main.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
