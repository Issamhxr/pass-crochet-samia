// Product variants types
export interface ProductVariant {
  type: 'color' | 'size' | 'material' | 'style' | 'custom'
  label: string
  options: {
    name: string
    value: string
    priceModifier?: number
  }[]
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  description: string
  materials: string
  dimensions: string
  careInstructions: string
  relatedProducts: string[]
  variants?: ProductVariant[]
  stock: number
}

// Product categories
export const CATEGORIES = [
  'Amigurumis',
  'Sacs en Granny',
  'Accessoires',
  'Petites créations',
  'Accessoires enfants',
]

// Complete product database with variants
export const products: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Amigurumi Ours',
    category: 'Amigurumis',
    price: 35,
    image: '/images/product-1.jpg',
    rating: 4.8,
    reviews: 24,
    inStock: true,
    stock: 15,
    description: 'Un adorable petit ours en crochet fait main avec amour. Parfait comme cadeau ou pour votre collection personnelle.',
    materials: 'Fil acrylique 100% (doux et hypoallergénique)',
    dimensions: 'Hauteur: 15cm',
    careInstructions: 'Lavage à la main avec eau tiède et savon doux',
    relatedProducts: ['5', '4'],
    variants: [
      {
        type: 'color',
        label: 'Couleur',
        options: [
          { name: 'Beige clair', value: 'beige' },
          { name: 'Marron clair', value: 'brown' },
          { name: 'Gris', value: 'gray' },
          { name: 'Blanc cassé', value: 'cream' },
        ]
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Sac à Main Granny',
    category: 'Sacs en Granny',
    price: 55,
    image: '/images/product-2.jpg',
    rating: 4.9,
    reviews: 31,
    inStock: true,
    stock: 8,
    description: 'Sac élégant en carré granny aux couleurs douces. Un accessoire intemporel qui complète parfaitement votre style.',
    materials: 'Fil coton biologique et acrylique mélangé',
    dimensions: 'Largeur: 35cm, Hauteur: 30cm, Profondeur: 15cm',
    careInstructions: 'Lavage à la main recommandé. Laisser sécher à plat.',
    relatedProducts: ['3', '6'],
    variants: [
      {
        type: 'color',
        label: 'Couleur',
        options: [
          { name: 'Rose et crème', value: 'pink-cream' },
          { name: 'Beige et rose', value: 'beige-pink' },
          { name: 'Multicolore', value: 'multicolor' },
        ]
      },
      {
        type: 'size',
        label: 'Taille',
        options: [
          { name: 'Petit', value: 'small' },
          { name: 'Moyen', value: 'medium', priceModifier: 10 },
          { name: 'Grand', value: 'large', priceModifier: 20 },
        ]
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Pochette Rose',
    category: 'Accessoires',
    price: 28,
    image: '/images/product-3.jpg',
    rating: 4.7,
    reviews: 18,
    inStock: true,
    stock: 20,
    description: 'Petite pochette rose pâle parfaite pour ranger vos essentiels. Délicate et pratique.',
    materials: 'Fil acrylique doux',
    dimensions: 'Largeur: 20cm, Hauteur: 15cm',
    careInstructions: 'Lavage à la main avec eau tiède',
    relatedProducts: ['1', '4'],
    variants: [
      {
        type: 'color',
        label: 'Couleur',
        options: [
          { name: 'Rose pâle', value: 'pink' },
          { name: 'Blanc cassé', value: 'cream' },
          { name: 'Bleu poudré', value: 'blue' },
          { name: 'Lavande', value: 'lavender' },
        ]
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Porte-clés Coloré',
    category: 'Petites créations',
    price: 15,
    image: '/images/product-4.jpg',
    rating: 4.6,
    reviews: 12,
    inStock: true,
    stock: 30,
    description: 'Petit porte-clés amigurumi coloré pour personnaliser votre quotidien.',
    materials: 'Fil acrylique',
    dimensions: 'Hauteur: 8cm',
    careInstructions: 'Nettoyage avec un chiffon sec',
    relatedProducts: ['1', '5'],
    variants: [
      {
        type: 'color',
        label: 'Personnage',
        options: [
          { name: 'Ours', value: 'bear' },
          { name: 'Chat', value: 'cat' },
          { name: 'Lapin', value: 'rabbit' },
          { name: 'Coeur', value: 'heart' },
        ]
      }
    ]
  },
  '5': {
    id: '5',
    name: 'Amigurumi Chat',
    category: 'Amigurumis',
    price: 40,
    image: '/images/product-5.jpg',
    rating: 4.9,
    reviews: 29,
    inStock: true,
    stock: 12,
    description: 'Un mignon petit chat en crochet avec des détails adorables.',
    materials: 'Fil acrylique premium',
    dimensions: 'Hauteur: 17cm',
    careInstructions: 'Lavage délicat à la main',
    relatedProducts: ['1', '6'],
    variants: [
      {
        type: 'color',
        label: 'Couleur du chat',
        options: [
          { name: 'Gris', value: 'gray' },
          { name: 'Orange', value: 'orange' },
          { name: 'Blanc', value: 'white' },
          { name: 'Noir', value: 'black' },
        ]
      }
    ]
  },
  '6': {
    id: '6',
    name: 'Sac d\'Enfant',
    category: 'Accessoires enfants',
    price: 32,
    image: '/images/product-6.jpg',
    rating: 4.8,
    reviews: 22,
    inStock: true,
    stock: 10,
    description: 'Petit sac parfait pour les enfants, fait avec des couleurs joyeuses.',
    materials: 'Fil acrylique',
    dimensions: 'Largeur: 25cm, Hauteur: 20cm',
    careInstructions: 'Lavage à la main',
    relatedProducts: ['2', '3'],
    variants: [
      {
        type: 'color',
        label: 'Couleur',
        options: [
          { name: 'Arc-en-ciel', value: 'rainbow' },
          { name: 'Rose et violet', value: 'pink-purple' },
          { name: 'Bleu et vert', value: 'blue-green' },
        ]
      }
    ]
  },
}

// Helper function to get product variants for display
export function getProductVariants(productId: string) {
  const product = products[productId]
  return product?.variants || []
}

// Helper function to calculate variant price
export function calculateVariantPrice(basePrice: number, variantValue: string): number {
  // This would need to be enhanced based on your variant selection logic
  return basePrice
}
