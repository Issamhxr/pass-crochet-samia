'use client'

import { CartProvider } from '@/lib/cart-context'
import { SiteSettingsProvider } from '@/lib/site-settings-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SiteSettingsProvider>
  )
}
