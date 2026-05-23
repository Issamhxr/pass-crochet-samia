import Link from 'next/link'
import { Facebook, Instagram, Mail } from 'lucide-react'
import { Newsletter } from './newsletter'

export function Footer() {
  return (
    <footer className="w-full bg-background">
      <Newsletter />
      <div className="w-full border-t-2 border-border bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-8 md:grid-cols-4 mb-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="text-2xl font-serif font-bold text-primary">
              Pass-Crochet
              <div className="text-sm font-light italic text-accent">
                Samia
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Créations faites main avec passion, patience et amour.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Boutique</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Amigurumis
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sacs en Granny
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Petites créations
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Ateliers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contact@passrochet.fr"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={16} />
                contact@passrochet.fr
              </a>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-10 mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="font-medium">
              © 2024 Pass-Crochet Samia. Tous les droits réservés.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-primary transition-colors font-medium">
                Mentions légales
              </Link>
              <Link href="#" className="hover:text-primary transition-colors font-medium">
                Politique de confidentialité
              </Link>
              <Link href="#" className="hover:text-primary transition-colors font-medium">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}
