'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Users,
  Menu, X, LogOut, Tag, Palette, Settings, ImageIcon, Globe, UserCog,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userName, setUserName] = useState('Admin')
  const [userInitial, setUserInitial] = useState('A')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name, email').eq('id', user.id).single().then(({ data }) => {
        const name = data?.full_name || data?.email || 'Admin'
        setUserName(name.split(' ')[0])
        setUserInitial(name[0].toUpperCase())
      })
    })
  }, [])

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/categories', label: 'Catégories', icon: Tag },
    { href: '/admin/product-variants', label: 'Variantes', icon: Palette },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { href: '/admin/analytics', label: 'Statistiques', icon: BarChart3 },
    { href: '/admin/users', label: 'Utilisateurs', icon: UserCog },
    { href: '/admin/design', label: 'Design & Images', icon: ImageIcon },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`fixed md:relative top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} bg-card border-r border-border`}>
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          {sidebarOpen && (
            <Link href="/admin" className="font-serif text-lg font-bold text-primary truncate">
              Samia Admin
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

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
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2 shrink-0">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/70 hover:bg-secondary hover:text-foreground transition-colors">
            <Globe size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm">Voir le site</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors md:hidden">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <Link href="/" target="_blank" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Globe size={16} />
              Voir le site
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {userInitial}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
