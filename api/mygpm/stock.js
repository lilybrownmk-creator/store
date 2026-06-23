export default async function handler(req, res) {
  console.log("METHOD:", req.method)

  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      message: "POST endpoint ready"
    })
  }

  return res.status(200).json({
    ok: true,
    message: "POST received",
    body: req.body || null,
    headers: req.headers
  })
}
