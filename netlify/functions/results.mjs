import { getStore } from '@netlify/blobs'

// GET /api/results?key=SECRET
// Returns every stored response as a JSON array for the dashboard.
//
// NOTE: This is a class project. "Auth" is a single shared secret passed as a
// query param and compared to the RESULTS_KEY env var. That is good enough for
// a graded demo with anonymous, non-sensitive data. Do not reuse this pattern
// for anything real.
export default async (req) => {
  const url = new URL(req.url)
  const provided = url.searchParams.get('key')
  const expected = process.env.RESULTS_KEY

  if (!expected) {
    return json({ error: 'RESULTS_KEY env var is not set on the server' }, 500)
  }
  if (provided !== expected) {
    return json({ error: 'unauthorized' }, 401)
  }

  const store = getStore('responses')
  const { blobs } = await store.list()

  const responses = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: 'json' }))
  )
  // Drop any nulls (deleted/corrupt) and sort newest last.
  const clean = responses
    .filter(Boolean)
    .sort((a, b) => String(a.completedAt).localeCompare(String(b.completedAt)))

  return json({ count: clean.length, responses: clean })
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const config = { path: '/api/results' }
