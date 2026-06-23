import { useState } from "react"

export default function MygpmTest() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const test = async () => {
    setLoading(true)

    const res = await fetch("/api/mygpm/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "test"
      },
      body: JSON.stringify({
        ean: "7290116440439",
        stock: 5,
        price: 1300
      })
    })

    const data = await res.json()
    setResult(data)

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>MYGPM TEST</h1>

      <button onClick={test} disabled={loading}>
        {loading ? "Testing..." : "Test API"}
      </button>

      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
