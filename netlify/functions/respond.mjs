import { getStore } from '@netlify/blobs'

// POST /api/respond
// Writes one completed response object to Netlify Blobs.
// Partial runs are never sent by the client, so every write here is a finished run.
export default async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid json' }, 400)
  }

  // Whitelist + light validation. We only store the fields in the data model,
  // and never trust the client for the timestamp.
  const record = {
    rate: num(body.rate),
    household: body.household,
    homeSize: body.homeSize,
    tenure: body.tenure,
    moveDesire: num(body.moveDesire),
    initialChoice: body.initialChoice === 'B' ? 'B' : 'A',
    flipThreshold: body.flipThreshold === null ? null : num(body.flipThreshold),
    neverFlipped: Boolean(body.neverFlipped),
    barrier: body.barrier,
    completedAt: new Date().toISOString(),
  }

  const store = getStore('responses')
  // Unique-enough key for a class project: timestamp + random suffix.
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  await store.setJSON(key, record)

  return json({ ok: true })
}

function num(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const config = { path: '/api/respond' }
