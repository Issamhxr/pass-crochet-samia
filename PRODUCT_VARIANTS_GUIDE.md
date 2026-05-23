# Product Variants & Categories Guide

## Overview

Pass-Crochet Samia now includes a comprehensive product variant system and category management. This allows you to offer customizable products with different colors, sizes, materials, and more.

## What Are Product Variants?

Product variants allow customers to customize their purchases. For example:
- **Color variants**: Choose between beige, pink, blue, etc.
- **Size variants**: Select small, medium, or large with different pricing
- **Material variants**: Cotton, acrylic, wool blends
- **Style variants**: Different designs or patterns

## Quick Start

### 1. Product Detail Page
When a customer views a product with variants:
- They see variant selector buttons (e.g., color options)
- Each variant option is clearly labeled
- Price automatically updates if variants have different pricing
- They add the selected variant to cart with all customization info

### 2. Admin Dashboard - Categories
Navigate to `/admin/categories` to:
- View all product categories
- Add new categories
- Edit existing category names
- Delete categories

**Access**: /admin/categories

### 3. Admin Dashboard - Product Variants
Navigate to `/admin/product-variants` to:
- See all products with their variants
- Expand each product to view variant details
- View variant options and price modifiers
- Add new variant options
- Edit or delete existing options

**Access**: /admin/product-variants

## Product Structure

### Basic Product Data
```typescript
interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  inStock: boolean
  stock: number
  description: string
  materials: string
  dimensions: string
  careInstructions: string
  relatedProducts: string[]
  variants?: ProductVariant[]  // Optional variants
}
```

### Variant Structure
```typescript
interface ProductVariant {
  type: 'color' | 'size' | 'material' | 'style' | 'custom'
  label: string  // Display name (e.g., "Couleur", "Taille")
  options: {
    name: string              // Display name (e.g., "Beige clair")
    value: string             // Internal value (e.g., "beige")
    priceModifier?: number    // Additional cost (e.g., +10 for large size)
  }[]
}
```

## Current Products with Variants

### 1. Amigurumi Ours (ID: 1)
- **Variant**: Color
- **Options**: Beige clair, Marron clair, Gris, Blanc cassé
- **Price Modifier**: None (all same price)

### 2. Sac à Main Granny (ID: 2)
- **Variant 1**: Color
  - Options: Rose et crème, Beige et rose, Multicolore
- **Variant 2**: Size
  - Petit: +0€
  - Moyen: +10€
  - Grand: +20€

### 3. Pochette Rose (ID: 3)
- **Variant**: Color
- **Options**: Rose pâle, Blanc cassé, Bleu poudré, Lavande
- **Price Modifier**: None

### 4. Porte-clés Coloré (ID: 4)
- **Variant**: Character/Style
- **Options**: Ours, Chat, Lapin, Cœur
- **Price Modifier**: None

### 5. Amigurumi Chat (ID: 5)
- **Variant**: Color
- **Options**: Gris, Orange, Blanc, Noir
- **Price Modifier**: None

### 6. Sac d'Enfant (ID: 6)
- **Variant**: Color
- **Options**: Arc-en-ciel, Rose et violet, Bleu et vert
- **Price Modifier**: None

## How to Add Variants to a Product

### Step 1: Edit Product Data
Edit `/lib/products-data.ts` and add a `variants` array to your product:

```typescript
{
  id: '7',
  name: 'New Product',
  // ... other properties ...
  variants: [
    {
      type: 'color',
      label: 'Couleur',
      options: [
        { name: 'Beige', value: 'beige' },
        { name: 'Rose', value: 'pink', priceModifier: 5 },
        { name: 'Bleu', value: 'blue' }
      ]
    },
    {
      type: 'size',
      label: 'Taille',
      options: [
        { name: 'Petit', value: 'small' },
        { name: 'Moyen', value: 'medium', priceModifier: 10 },
        { name: 'Grand', value: 'large', priceModifier: 20 }
      ]
    }
  ]
}
```

### Step 2: UI Updates Automatically
The product detail page automatically:
- Detects variants from the product data
- Renders variant selector buttons
- Updates price based on selections
- Includes variant info in cart

## How Product Variants Work on Product Page

### Rendering
```typescript
// For each variant in product.variants
// Show buttons for each option
// Button styling changes based on selection
// Price updates dynamically
```

### Cart Integration
When customer adds to cart with variants:
- Variant selections are saved in the cart item name
- Final price calculated with modifiers
- Example: "Sac à Main Granny - Couleur: Rose et crème, Taille: Grand"

### Price Calculation
```typescript
function calculateVariantPrice(basePrice: number, selectedVariants: Record<string, string>) {
  let total = basePrice
  // Add price modifiers for each selected variant
  return total
}
```

## Admin Features

### Categories Management
- **View**: See all current categories at `/admin/categories`
- **Add**: Create new categories with the form
- **Edit**: Update category names
- **Delete**: Remove unused categories
- **Validation**: Category names must be unique

### Product Variants Management
- **View**: See all variants per product at `/admin/product-variants`
- **Expand**: Click products to see variant details
- **Add Options**: Add new color/size/material options
- **Edit**: Modify variant option names and prices
- **Delete**: Remove variant options
- **Preview**: See how options appear to customers

## Styling & UI

### Variant Selector UI
- Clean button interface
- Selected state highlighted with primary color
- Check icon appears when selected
- Responsive grid layout
- Hover effects

### Color Examples
The UI uses your theme colors:
- Primary color for selected states
- Secondary background for variant containers
- Foreground text for clarity
- Border styling for definition

## Database Integration Notes

**Current State**: Data is stored in TypeScript (`/lib/products-data.ts`)

**Future Enhancement**: Connect to database:
```typescript
// This would be implemented when adding a backend
const product = await db.products.findById(id)
const variants = await db.variants.findByProductId(id)
```

## Cart & Checkout

### What Happens When Customer Adds Variant Product
1. Customer selects variant options (e.g., "Rose", "Large")
2. Final price calculated with modifiers
3. Item added to cart with variant details in name
4. Cart displays variant information
5. Checkout includes all variant info in order

### Order Management
Admins see in Orders view:
- Product name with variant specs
- Final price (including modifiers)
- Quantity ordered

## Best Practices

### Color Naming
- Use descriptive French names: "Rose pâle", "Bleu poudré", "Marron clair"
- Match brand aesthetic
- Be consistent across products

### Size Naming
- Use standard terms: "Petit", "Moyen", "Grand"
- Or use measurements: "S", "M", "L"
- Clearly indicate price differences

### Price Modifiers
- Keep modifiers reasonable
- Document pricing clearly
- Consider material cost differences
- Update variants when prices change

## Technical Details

### Files Involved
- `/lib/products-data.ts` - Product database with variants
- `/app/products/[id]/page.tsx` - Product detail page with variant UI
- `/app/admin/product-variants/page.tsx` - Admin variant management
- `/app/admin/categories/page.tsx` - Category management
- `/components/header.tsx` - Navigation with admin links

### Key Functions
```typescript
// Get variants for a product
getProductVariants(productId: string): ProductVariant[]

// Calculate price with variant modifiers
calculateVariantPrice(basePrice: number, variantValue: string): number

// Handle variant selection
handleVariantChange(variantType: string, optionValue: string): void
```

## Troubleshooting

### Variants Not Showing?
1. Check if product has `variants` array in data
2. Verify variant structure matches interface
3. Clear cache and rebuild: `pnpm build`

### Price Not Updating?
1. Ensure price modifiers are numbers
2. Check `calculateFinalPrice()` function
3. Verify variant selection is captured

### Admin Pages Not Accessible?
1. Go to `/admin/categories` or `/admin/product-variants`
2. Ensure admin layout is properly loaded
3. Check browser console for errors

## Future Enhancements

Planned improvements:
- [ ] Database integration for variants
- [ ] Variant images (e.g., color swatches)
- [ ] Variant inventory tracking
- [ ] Customer reviews by variant
- [ ] Variant search filters
- [ ] Bulk variant management
- [ ] Variant templates for quick setup

## Support

For questions about product variants:
1. Check this guide
2. Review product data in `/lib/products-data.ts`
3. Inspect product detail page code
4. Review admin pages for examples
