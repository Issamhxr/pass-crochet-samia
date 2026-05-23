import { Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Community() {
  return (
    <section className="w-full py-16 md:py-28 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-14">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground">
              Rejoignez mon univers
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Suivez-moi pour découvrir mes créations, mes inspirations et mon quotidien crochet
            </p>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              '/images/product-1.jpg',
              '/images/product-2.jpg',
              '/images/product-3.jpg',
              '/images/product-4.jpg',
              '/images/product-5.jpg',
              '/images/product-6.jpg',
              '/images/hero-crochet.jpg',
              '/images/about-crochet.jpg'
            ].map((image, item) => (
              <div 
                key={item}
                className="relative h-52 rounded-xl overflow-hidden bg-muted/30 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <Image
                  src={image}
                  alt={`Instagram post ${item + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Instagram className="text-white drop-shadow-lg" size={36} />
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-full px-8 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Instagram size={20} />
              Suivre Instagram
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 gap-2 rounded-full px-8 font-semibold"
            >
              <Twitter size={20} />
              Partager
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
