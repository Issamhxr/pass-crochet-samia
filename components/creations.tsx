import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
}

const products: Product[] = [
  {
    id: '1',
    name: 'Amigurumi Ours',
    category: 'Amigurumis',
    price: 35,
    image: '/images/product-1.jpg'
  },
  {
    id: '2',
    name: 'Sac à Main Granny',
    category: 'Sacs en Granny',
    price: 55,
    image: '/images/product-2.jpg'
  },
  {
    id: '3',
    name: 'Pochette Rose',
    category: 'Accessoires',
    price: 28,
    image: '/images/product-3.jpg'
  },
  {
    id: '4',
    name: 'Porte-clés Coloré',
    category: 'Petites créations',
    price: 15,
    image: '/images/product-4.jpg'
  },
  {
    id: '5',
    name: 'Amigurumi Chat',
    category: 'Amigurumis',
    price: 40,
    image: '/images/product-5.jpg'
  },
  {
    id: '6',
    name: 'Sac d\'Enfant',
    category: 'Accessoires enfants',
    price: 32,
    image: '/images/product-6.jpg'
  },
]

export function Creations() {
  return (
    <section id="creations" className="w-full py-16 md:py-28 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-14">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl md:text-5xl font-serif font-bold text-foreground">
              Mes créations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Découvrez une collection faite avec soin, chaque pièce unique est réalisée avec amour
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden bg-card hover:shadow-xl transition-all duration-300 border-border/50 group cursor-pointer">
                  {/* Image */}
                  <div className="relative h-72 w-full overflow-hidden bg-muted/30">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-accent/95 text-background px-3 py-1.5 rounded-full text-xs font-bold">
                      {product.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        {product.price}€
                      </p>
                    </div>

                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                      <Eye size={18} />
                      Voir le produit
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
