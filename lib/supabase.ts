import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

// ---- Variations (WooCommerce-style attribute combinations) ----
export interface ProductAttribute {
  label: string          // e.g. "Couleur"
  values: string[]       // e.g. ["Rouge", "Bleu"]
}

export interface ProductCombo {
  key: string                          // stable id, e.g. "Rouge|40"
  options: Record<string, string>      // { Couleur: "Rouge", Taille: "40" }
  price: number                        // absolute price for this combination
  stock: number
}

export interface ProductVariations {
  attributes: ProductAttribute[]
  combos: ProductCombo[]
}

export const EMPTY_VARIATIONS: ProductVariations = { attributes: [], combos: [] }

export interface DbProduct {
  id: string
  name: string
  category: string
  price: number
  image: string
  stock: number
  in_stock: boolean
  description: string
  materials: string
  dimensions: string
  care_instructions: string
  related_products: string[]
  variants: any[]
  variations: ProductVariations | null
  rating: number
  reviews: number
  featured: boolean
  created_at?: string
}

export function dbToProduct(row: DbProduct) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    image: row.image,
    stock: row.stock,
    inStock: row.in_stock,
    description: row.description || '',
    materials: row.materials || '',
    dimensions: row.dimensions || '',
    careInstructions: row.care_instructions || '',
    relatedProducts: row.related_products || [],
    variants: row.variants || [],
    variations: (row.variations && row.variations.attributes) ? row.variations : EMPTY_VARIATIONS,
    rating: Number(row.rating) || 5.0,
    reviews: row.reviews || 0,
    featured: row.featured ?? false,
  }
}

export function productToDb(p: ReturnType<typeof dbToProduct> & { id?: string }) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    stock: p.stock,
    in_stock: p.inStock,
    description: p.description,
    materials: p.materials || '',
    dimensions: p.dimensions || '',
    care_instructions: p.careInstructions || '',
    related_products: p.relatedProducts || [],
    variants: p.variants || [],
    variations: (p as any).variations || EMPTY_VARIATIONS,
    rating: p.rating || 5.0,
    reviews: p.reviews || 0,
    featured: (p as any).featured ?? false,
  }
}

// Cartesian product of attribute values → list of option maps
export function generateCombos(attributes: ProductAttribute[]): Record<string, string>[] {
  const valid = attributes.filter(a => a.label.trim() && a.values.length > 0)
  if (valid.length === 0) return []
  let result: Record<string, string>[] = [{}]
  for (const attr of valid) {
    const next: Record<string, string>[] = []
    for (const combo of result) {
      for (const value of attr.values) {
        next.push({ ...combo, [attr.label]: value })
      }
    }
    result = next
  }
  return result
}

export function comboKey(options: Record<string, string>): string {
  return Object.keys(options).sort().map(k => `${k}:${options[k]}`).join('|')
}

// ---- Orders ----
export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

export interface DbOrder {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: any
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paypal_transaction_id: string | null
  user_id: string | null
  created_at: string
}
