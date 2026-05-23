'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: 'Combien de temps faut-il pour préparer une commande ?',
    answer: 'Chaque commande est réalisée à la main, ce qui prend généralement entre 5 et 15 jours selon la complexité de la création. Je vous tiendrai informé de l\'avancement de votre commande via email.'
  },
  {
    id: 2,
    question: 'Proposez-vous des commandes personnalisées ?',
    answer: 'Oui, absolument ! Je serais ravie de réaliser une création sur mesure selon vos désirs. Contactez-moi via le formulaire de contact pour discuter de votre projet.'
  },
  {
    id: 3,
    question: 'Quels sont les délais de livraison ?',
    answer: 'Les commandes sont généralement expédiées sous 3-5 jours ouvrables après la finalisation de la création. La livraison prend ensuite 3-7 jours selon votre localisation.'
  },
  {
    id: 4,
    question: 'Acceptez-vous les retours et échanges ?',
    answer: 'Si vous recevez un produit endommagé ou ne correspondant pas à la description, je propose un échange gratuit. Contactez-moi dans les 7 jours suivant la réception.'
  },
  {
    id: 5,
    question: 'Comment entretenir mes créations en crochet ?',
    answer: 'Je recommande un lavage à la main à l\'eau tiède avec un savon doux. Évitez l\'eau de Javel et séchez à l\'air libre. Chaque commande comprend des instructions d\'entretien détaillées.'
  },
  {
    id: 6,
    question: 'Proposez-vous des réductions pour les achats en gros ?',
    answer: 'Oui, pour les commandes importantes ou les projets d\'entreprise, je peux discuter de tarifs spéciaux. Contactez-moi directement pour en parler.'
  },
  {
    id: 7,
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'J\'accepte tous les moyens de paiement courants : cartes bancaires, PayPal, et virements bancaires. Le paiement sécurisé est garanti pour tous les achats.'
  },
  {
    id: 8,
    question: 'Y a-t-il une garantie sur les produits ?',
    answer: 'Oui, tous les produits sont garantis pour un an contre les défauts de fabrication. Si un problème survient, contactez-moi et je règlerai la situation rapidement.'
  }
]

function FAQItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={onClick}
        className="w-full p-6 text-left bg-card hover:bg-card/80 transition-colors flex items-center justify-between gap-4"
      >
        <h3 className="text-lg font-semibold text-foreground">
          {item.question}
        </h3>
        <ChevronDown 
          size={24} 
          className={`text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="border-t border-border px-6 py-4 bg-background">
          <p className="text-muted-foreground leading-relaxed">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              Questions fréquentes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez les réponses à vos questions sur nos produits et services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full py-16 md:py-24 bg-background flex-grow">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqItems.map(item => (
              <FAQItem
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onClick={() => toggleOpen(item.id)}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl text-center space-y-4 border border-primary/20">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h2>
            <p className="text-muted-foreground">
              N&apos;hésitez pas à me contacter directement. Je serais ravie de répondre à toutes vos questions.
            </p>
            <a 
              href="/contact"
              className="inline-block mt-4 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              Me contacter
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
