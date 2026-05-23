'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Users,
  Menu, X, LogOut, Tag, Palette, Settings, ImageIcon, Globe,
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/categories', label: 'Catégories', icon: Tag },
    { href: '/admin/product-variants', label: 'Variantes', icon: Palette },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/analytics', label: 'Statistiques', icon: BarChart3 },
    { href: '/admin/customers', label: 'Clients', icon: Users },
    { href: '/admin/design', label: 'Design & Images', icon: ImageIcon },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
  ]

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-card border-r border-border`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          {sidebarOpen && (
            <Link href="/admin" className="font-serif text-lg font-bold text-primary truncate">
              Samia Admin
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* View site + Logout */}
        <div className="p-3 border-t border-border space-y-2 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors`}
          >
            <Globe size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Voir le site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : ''}`}>
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe size={16} />
              Voir le site
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                S
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Samia</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
