import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // ❌ само POST дозволено
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  // 🔐 API KEY CHECK
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.MYGPM_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sku, quantity } = req.body;

  if (!sku || quantity === undefined) {
    return res.status(400).json({ error: 'Missing sku or quantity' });
  }

  try {
    // 1. најди variant по SKU
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', sku)
      .single();

    if (variantError || !variant) {
      return res.status(404).json({ error: 'SKU not found' });
    }

    // 2. провери дали постои inventory ред
    const { data: inventory } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('variant_id', variant.id)
      .single();

    // 3. ако не постои → креирај
    if (!inventory) {
      await supabase.from('inventory').insert({
        variant_id: variant.id,
        quantity: quantity
      });
    } else {
      // 4. ако постои → update
      await supabase
        .from('inventory')
        .update({
          quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('variant_id', variant.id);
    }

    // 5. log movement
    await supabase.from('stock_movements').insert({
      variant_id: variant.id,
      change_amount: quantity,
      reason: 'mygpm_sync',
      source: 'mygpm'
    });

    // 6. response
    return res.status(200).json({
      success: true,
      sku,
      quantity
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Server error',
      details: err.message
    });
  }
}
