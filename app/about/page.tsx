import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              À propos de moi
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez mon histoire et ma passion pour le crochet
            </p>
          </div>
        </div>
      </section>

      {/* Main Story */}
      <section className="w-full py-16 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-crochet.jpg"
                alt="Samia créant du crochet"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-serif font-bold text-foreground mb-4">
                  Mon parcours
                </h2>
                <div className="w-20 h-1 bg-primary rounded-full"></div>
              </div>

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Depuis mon enfance, le crochet a été bien plus qu&apos;un simple loisir pour moi. C&apos;est un moyen d&apos;expression unique, un moment de calme et une véritable passion qui grandit chaque jour.
                </p>

                <p>
                  Ce qui m&apos;a d&apos;abord attiré, c&apos;est la simplicité du geste et la complexité des créations possibles. Avec juste un crochet et de la laine, on peut créer des mondes entiers, des amigurumis attendrissants, des accessoires utiles et des pièces d&apos;art.
                </p>

                <p>
                  Chaque création que je réalise est une méditation en mouvement, un instant présent où seules mes mains, ma laine et mon amour pour cet art comptent. C&apos;est exactement ce que je souhaite transmettre à travers Pass-Crochet Samia.
                </p>

                <p>
                  Aujourd&apos;hui, je partage des créations uniques, inspirées par la douceur, l&apos;enfance et le fait main. Chaque pièce porte une part de mon histoire, de ma passion et de mon amour pour cet art extraordinaire.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6 pt-4">
                <p className="italic text-primary font-semibold text-lg">
                  &quot;Le crochet n&apos;est pas qu&apos;un loisir, c&apos;est une forme de méditation, de créativité et d&apos;amour.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-secondary/20 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <h2 className="text-5xl font-serif font-bold text-foreground">
              Mes valeurs
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-card rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">🧶</div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Authenticité</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chaque création est entièrement faite main, avec sincérité et sans compromis sur la qualité.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">💚</div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Passion</h3>
              <p className="text-muted-foreground leading-relaxed">
                La passion est le moteur de chaque création. Je mets mon cœur dans chaque pièce réalisée.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Créativité</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chaque création est unique et repousse les limites de ce que je peux imaginer et créer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              Prêt à explorer mes créations ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Parcourez ma collection de créations uniques et découvrez votre nouvelle pièce préférée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold shadow-md hover:shadow-lg transition-all">
                Voir la boutique
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 rounded-full font-semibold"
              >
                Me contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
