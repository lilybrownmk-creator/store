import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      message: 'POST endpoint ready'
    })
  }

  try {
    const { ean, stock } = req.body

    if (!ean || stock === undefined) {
      return res.status(400).json({
        ok: false,
        error: 'ean and stock required'
      })
    }

    const { data, error } = await supabase
      .from('products')
      .update({ stock })
      .eq('ean', ean)
      .select()

    if (error) throw error

    return res.status(200).json({
      ok: true,
      updated: data
    })
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    })
  }
}
