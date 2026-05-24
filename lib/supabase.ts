import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

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
    rating: p.rating || 5.0,
    reviews: p.reviews || 0,
    featured: (p as any).featured ?? false,
  }
}
