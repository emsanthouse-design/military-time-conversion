import { getStore } from '@netlify/blobs'

// POST /api/reset?key=SECRET
// Deletes every stored response so you can start the real run with a clean
// dataset after testing. Guarded by the same RESULTS_KEY secret as the
// dashboard, and POST-only so it can't be triggered by a stray link click.
//
// Class project note: this is a deliberately simple "wipe everything" utility.
// There is no per-row delete and no undo. Use it once, before collecting real data.
export default async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405)
  }

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
  await Promise.all(blobs.map((b) => store.delete(b.key)))

  return json({ ok: true, deleted: blobs.length })
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const config = { path: '/api/reset' }
