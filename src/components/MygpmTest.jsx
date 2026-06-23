import { useState } from "react"

export default function MygpmTest() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const testAPI = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/mygpm/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-key"
        },
        body: JSON.stringify({
          ean: "7290116440439",
          stock: 5,
          price: 1300
        })
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: err.message })
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>MYGPM API TEST</h2>

      <button onClick={testAPI} disabled={loading}>
        {loading ? "Testing..." : "Test API"}
      </button>

      <pre style={{ marginTop: 20 }}>
        {result ? JSON.stringify(result, null, 2) : "No result yet"}
      </pre>
    </div>
  )
}
