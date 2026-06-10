// ZR Macedonia — Inventory Import Script
// Reads Warehouse Skopje.csv and upserts all products into Supabase
// Run: node scripts/import-inventory.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://ywfgrzvzhbudyxllrevb.supabase.co'
// Service role key needed for admin inserts — paste yours here or set env var
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'REPLACE_ME'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ── Price table: [categoryKeyword, sizeKeyword] → price ──────────────────────
function getPrice(name, size) {
  const n = name.toLowerCase()
  const s = (size || '').toLowerCase()

  // Perfume
  if (n.includes('perfume')) {
    if (s.includes('50')) return 95.00
    if (s.includes('10')) return 24.00
  }
  // Hand cream
  if (n.startsWith('hand cream') || n.startsWith('hand cream')) {
    if (s.includes('5000')) return 120.00
    return 16.00 // 50ml
  }
  // Body cream
  if (n.includes('body cream') || n.includes('body cream')) {
    return 35.00
  }
  // Body scrub
  if (n.includes('body scrub')) {
    if (s.includes('70')) return 12.00
    return 31.00 // 200ml
  }
  // Body butter
  if (n.includes('body butter')) return 43.00
  // Body oil
  if (n.includes('body oil')) return 30.00
  // Shower gel
  if (n.includes('shower gel')) return 23.00
  // Liquid soap
  if (n.includes('liquid soap')) {
    if (s.includes('5000')) return 120.00
    return 21.00 // 300ml
  }
  // Solid soap / Soap
  if (n.includes('soap')) {
    if (s.includes('100')) return 16.00
    return 9.00 // 75g
  }
  // Dead sea salt
  if (n.includes('dead sea salt')) {
    if (s.includes('500')) return 26.00
    return 19.00 // 250g
  }
  // Diffuser
  if (n.includes('diffuser')) {
    if (s.includes('212')) return 85.00
    if (s.includes('85')) return 40.00
    return 85.00
  }
  // Candle
  if (n.includes('candle')) return 40.00
  // Shampoo (all variants)
  if (n.includes('shampoo')) return 25.00
  // Hair conditioner
  if (n.includes('hair conditioner') || n.includes('conditioner')) return 25.00
  // Keratin hair mask
  if (n.includes('keratin hair mask') || n.includes('hair mask')) return 27.00
  // Hair serum
  if (n.includes('hair serum')) return 24.00
  // Moisturizing cream / curly hair
  if (n.includes('moisturizing cream') || n.includes('curly hair')) return 27.00
  // Antiperspirant
  if (n.includes('antiperspirant')) return 19.00
  // Antiseptic hand spray
  if (n.includes('antiseptic') && n.includes('spray')) {
    if (s.includes('50')) return 10.00
    return 7.00 // 20ml
  }
  // Antiseptic hand gel
  if (n.includes('antiseptic') && n.includes('gel')) {
    if (s.includes('5000')) return 60.00
    return 10.00 // 60ml
  }

  // Fallback
  console.warn(`  ⚠ No price rule for: "${name}" (${size}) — defaulting to €9.00`)
  return 9.00
}

// ── Category mapping ──────────────────────────────────────────────────────────
function getCategory(name) {
  const n = name.toLowerCase()
  if (n.includes('perfume')) return 'Perfume'
  if (n.includes('diffuser')) return 'Home Scent'
  if (n.includes('candle')) return 'Home Scent'
  if (n.startsWith('hand cream') || n.includes('hand cream')) return 'Hands'
  if (n.includes('body scrub') || n.includes('body cream') || n.includes('body butter') ||
      n.includes('body oil') || n.includes('shower gel') || n.includes('liquid soap') ||
      n.includes('dead sea salt')) return 'Body'
  if (n.includes('soap')) return 'Body'
  if (n.includes('shampoo') || n.includes('hair conditioner') || n.includes('conditioner') ||
      n.includes('keratin') || n.includes('hair serum') || n.includes('hair mask') ||
      n.includes('curly hair')) return 'Hair'
  if (n.includes('antiperspirant') || n.includes('antiseptic')) return 'Self Care'
  return 'Body'
}

// ── Parse size from "(50 ml)" / "(75 g)" etc ─────────────────────────────────
function parseNameAndSize(article) {
  const match = article.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match) return { name: match[1].trim(), size: match[2].trim() }
  return { name: article.trim(), size: null }
}

// ── Parse CSV ─────────────────────────────────────────────────────────────────
function parseCSV(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const lines = raw.split('\n')
  const products = []

  for (const line of lines) {
    // Skip header/empty lines — data rows have a barcode (numeric) as first field
    const firstField = line.split(',')[0].trim()
    if (!/^\d{13}$/.test(firstField)) continue

    // Simple CSV parse respecting quoted fields
    const fields = []
    let cur = '', inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ }
      else if (ch === ',' && !inQ) { fields.push(cur); cur = '' }
      else cur += ch
    }
    fields.push(cur)

    const ean = fields[0].trim()
    const article = fields[1].trim()
    const availability = parseInt(fields[4]) || 0

    const { name, size } = parseNameAndSize(article)
    const price = getPrice(name, size)
    const category = getCategory(name)

    products.push({ ean, name, size, price, stock: availability, category })
  }
  return products
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const csvPath = join(__dirname, '../../Downloads/Warehouse Skopje.csv')
    .replace('/Desktop/ZR APP/zr-macedonia/scripts/../../', '/Desktop/')
    // Resolve path: script is at /Desktop/ZR APP/zr-macedonia/scripts/
    // CSV is at /Users/admin/Downloads/

  const resolvedCsv = '/Users/admin/Downloads/Warehouse Skopje.csv'

  console.log('📦 Parsing CSV…')
  const products = parseCSV(resolvedCsv)
  console.log(`   Found ${products.length} products\n`)

  if (SERVICE_ROLE_KEY === 'REPLACE_ME') {
    console.error('❌  Set SUPABASE_SERVICE_ROLE_KEY env var before running.')
    console.log('\nPreview of first 3 products:')
    products.slice(0, 3).forEach(p => console.log(JSON.stringify(p, null, 2)))
    process.exit(1)
  }

  console.log('🚀 Upserting into Supabase…')

  // Insert in batches of 50
  const BATCH = 50
  let inserted = 0, errors = 0

  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH)
    const rows = batch.map(p => ({
      name: p.name,
      ean: p.ean,
      price: p.price,
      stock: p.stock,
      category: p.category,
      size: p.size,
      is_active: true,
    }))

    const { error } = await supabase.from('products').insert(rows)
    if (error) {
      console.error(`  ❌ Batch ${i}–${i + batch.length}: ${error.message}`)
      errors++
    } else {
      inserted += batch.length
      console.log(`  ✅ Inserted rows ${i + 1}–${i + batch.length}`)
    }
  }

  console.log(`\n✨ Done — ${inserted} inserted, ${errors} batch errors`)
}

main().catch(console.error)
