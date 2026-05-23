'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, Settings } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useSiteSettings } from '@/lib/site-settings-context'

export function HeaderWrapper() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { settings } = useSiteSettings()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-serif font-bold text-primary">
              {settings.siteName.split(' ')[0]}
              <span className="block text-sm font-light italic text-accent">
                {settings.siteName.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Boutique
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/#workshops"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Ateliers
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hidden md:flex items-center justify-center p-2 text-foreground hover:text-primary transition-colors" title="Admin">
              <Settings size={20} />
            </Link>
            <Link href="/cart" className="relative flex items-center justify-center p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-accent text-xs flex items-center justify-center text-background font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden items-center justify-center p-2 text-foreground hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="space-y-4 px-4 py-4">
              <Link
                href="/"
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Accueil
              </Link>
              <Link
                href="/shop"
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Boutique
              </Link>
              <Link
                href="/about"
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                À propos
              </Link>
              <Link
                href="/#workshops"
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Ateliers
              </Link>
              <Link
                href="/contact"
                className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
