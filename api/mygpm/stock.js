export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    env_check: {
      supabase_url: process.env.SUPABASE_URL ? true : false,
      service_role: process.env.SUPABASE_SERVICE_ROLE_KEY ? true : false,
      mygpm_key: process.env.MYGPM_API_KEY ? true : false
    }
  })
}
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // само POST дозволено
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  // API key check
  const apiKey = req.headers['x-api-key']
  if (apiKey !== process.env.MYGPM_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { ean, stock, price } = req.body

  if (!ean || stock === undefined) {
    return res.status(400).json({ error: 'Missing ean or stock' })
  }

  try {
    // најди продукт по EAN
    const { data: product, error } = await supabase
      .from('products')
      .select('id')
      .eq('ean', ean)
      .single()

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // update stock + price
    await supabase
      .from('products')
      .update({
        stock,
        price,
        updated_at: new Date().toISOString()
      })
      .eq('id', product.id)

    return res.status(200).json({
      success: true,
      ean,
      stock,
      price
    })

  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      details: err.message
    })
  }
}
