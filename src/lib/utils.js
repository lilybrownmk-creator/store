import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Format a price in Macedonian Denar — prices are stored in MKD */
export function formatPrice(price) {
  return `${Math.round(price).toLocaleString('mk-MK')} ден`
}

/** Generate a ZR order number */
export function generateOrderNumber() {
  return `ZR-${Date.now().toString(36).toUpperCase()}`
}

// ─── Product name helpers (Macedonia) ───────────────────────────────────────
// Macedonia products use "Type Scent" names, e.g. "Body Cream Black Vanilla".
// These helpers extract the type prefix and the display (scent) portion.

const _TYPE_PREFIXES = [
  'Keratin Hair Mask', 'Hair Conditioner', 'Hair Serum',
  'Moisturizing Cream for Curly Hair', 'Daily Shampoo', 'Renewing Shampoo',
  'Body Butter', 'Body Cream', 'Body Scrub', 'Body Oil',
  'Antiperspirant Roll-On', 'Antiseptic Hand Gel', 'Antiseptic Hand Spray',
  'Oakmoss and Amber Liquid Soap', 'Orange and Jasmine Liquid Soap',
  'Orange and Jasmine Body Oil', 'Old Fashion Soap',
  'Liquid Soap', 'Shower Gel', 'Hand Cream',
  'Dead Sea Salt', 'Diffuser', 'Perfume', 'Shampoo', 'Candle', 'Soap',
]

/** Returns the product-type prefix from a Macedonia product name, e.g. "Diffuser" */
export function getProductType(name) {
  if (!name) return ''
  for (const p of _TYPE_PREFIXES) {
    if (name.startsWith(p)) return p
  }
  return name
}

const _TYPE_SUFFIXES = [' Liquid Soap', ' Body Oil', ' Body Cream', ' Soap', ' Shampoo']

/** Returns the scent/display portion of a product name (strips the type prefix). */
export function getDisplayName(name) {
  if (!name) return ''
  const type = getProductType(name)
  if (!type) return name
  if (type === name) {
    // Name IS the type — scent prefix before standard suffix (inverted-name products)
    for (const suf of _TYPE_SUFFIXES) {
      if (name.endsWith(suf)) return name.slice(0, -suf.length).trim() || name
    }
    return name
  }
  const rest = name.slice(type.length).trim()
  return rest || name
}

/** Normalise type variants to canonical tab category values */
export function normaliseType(type) {
  if (type.includes('Shampoo')) return 'Shampoo'
  if (type === 'Moisturizing Cream for Curly Hair') return 'Hair Conditioner'
  if (type === 'Hair Serum') return 'Hair Conditioner'
  if (type.includes('Antiperspirant') || type.includes('Antiseptic')) return 'Self Care'
  if (type === 'Old Fashion Soap') return 'Soap'
  if (type === 'Oakmoss and Amber Liquid Soap' || type === 'Orange and Jasmine Liquid Soap') return 'Liquid Soap'
  if (type === 'Orange and Jasmine Body Oil') return 'Body Oil'
  return type
}
