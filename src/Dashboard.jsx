import { useEffect, useMemo, useState } from 'react'
import './dashboard.css'

// /results?key=SECRET
// Plain readable analytics page (no 8-bit styling). Computes every metric for
// locked-in movers, everyone else, and combined.

// Segmentation is hard-coded and defined before any data exists.
const isLockedIn = (r) => Number(r.rate) < 5.5 && Number(r.moveDesire) >= 3

const FLIP_BUCKETS = [25000, 50000, 75000, 100000, 150000]
const FLOOR_BUCKETS = [7500, 5000, 2500, 1000, 0]
const BARRIERS = [
  { key: 'rate', label: 'My mortgage rate' },
  { key: 'costs', label: 'Costs and fees of selling' },
  { key: 'hassle', label: 'The hassle of moving' },
  { key: 'inventory', label: 'Nothing suitable on the market' },
  { key: 'dont_want', label: "Honestly, I don't want to move" },
]
// Plausible lender budget band overlaid on the flip-threshold histogram.
const BUDGET_BAND = [15000, 40000]

const fmt = (n) => '$' + Number(n).toLocaleString('en-US')

export default function Dashboard() {
  const key = new URLSearchParams(window.location.search).get('key') || ''
  const [state, setState] = useState({ status: 'loading', data: null, error: '' })

  useEffect(() => {
    if (!key) {
      setState({ status: 'error', data: null, error: 'Missing ?key= in the URL.' })
      return
    }
    fetch(`/api/results?key=${encodeURIComponent(key)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `request failed (${res.status})`)
        }
        return res.json()
      })
      .then((data) =>
        setState({ status: 'ready', data: data.responses || [], error: '' })
      )
      .catch((err) =>
        setState({ status: 'error', data: null, error: err.message })
      )
  }, [key])

  if (state.status === 'loading') {
    return <Shell><p>Loading...</p></Shell>
  }
  if (state.status === 'error') {
    return (
      <Shell>
        <p className="dash-error">Could not load results: {state.error}</p>
        <p>Add the correct <code>?key=SECRET</code> to the URL.</p>
      </Shell>
    )
  }

  return <Loaded responses={state.data} rawKey={key} />
}

function Loaded({ responses, rawKey }) {
  const lockedIn = useMemo(() => responses.filter(isLockedIn), [responses])
  const everyoneElse = useMemo(
    () => responses.filter((r) => !isLockedIn(r)),
    [responses]
  )

  const segments = [
    { name: 'Locked-in movers', rows: lockedIn, target: true },
    { name: 'Everyone else', rows: everyoneElse, target: false },
    { name: 'Combined', rows: responses, target: false },
  ]

  return (
    <Shell>
      <header className="dash-head">
        <h1>Rate Quest results</h1>
        <p className="dash-sub">
          {responses.length} total &middot; {lockedIn.length} locked-in movers
          &middot; {everyoneElse.length} everyone else
        </p>
        <p className="dash-note">
          Locked-in mover = current rate &lt; 5.5% AND move desire &ge; 3.
        </p>
        <a
          className="dash-export"
          href={`/api/results?key=${encodeURIComponent(rawKey)}`}
          target="_blank"
          rel="noreferrer"
        >
          Raw JSON export &#8599;
        </a>
      </header>

      {responses.length === 0 && (
        <p className="dash-empty">No responses yet. Go play a round.</p>
      )}

      <Section title="Initial choice split (A: Rate Shield vs B: Treasure Chest)">
        <div className="seg-grid">
          {segments.map((s) => (
            <ChoiceSplit key={s.name} name={s.name} rows={s.rows} />
          ))}
        </div>
      </Section>

      <Section title="Flip threshold distribution (Card A choosers)">
        <p className="band-label">
          Shaded band = plausible lender budget {fmt(BUDGET_BAND[0])}&ndash;
          {fmt(BUDGET_BAND[1])}. ESTIMATE, verify before pitch.
        </p>
        <div className="seg-grid">
          {segments.map((s) => (
            <FlipHistogram key={s.name} name={s.name} rows={s.rows} />
          ))}
        </div>
      </Section>

      <Section title="Switch-back floor distribution (Card B choosers)">
        <div className="seg-grid">
          {segments.map((s) => (
            <FloorHistogram key={s.name} name={s.name} rows={s.rows} />
          ))}
        </div>
      </Section>

      <Section title="Barrier: what's really keeping them in their home?">
        <div className="seg-grid">
          {segments.map((s) => (
            <BarrierBreakdown
              key={s.name}
              name={s.name}
              rows={s.rows}
              highlightDontWant={s.target}
            />
          ))}
        </div>
      </Section>

      <DangerZone rawKey={rawKey} count={responses.length} />
    </Shell>
  )
}

// Wipe-everything control. Two confirmations, then POSTs to /api/reset with the
// dashboard key. Use once after testing, before the real run.
function DangerZone({ rawKey, count }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const clearAll = async () => {
    if (
      !window.confirm(
        `Permanently delete all ${count} response(s)? This cannot be undone.`
      )
    ) {
      return
    }
    if (window.prompt('Type CLEAR to confirm.') !== 'CLEAR') {
      setMsg('Cancelled. Nothing was deleted.')
      return
    }
    setBusy(true)
    setMsg('')
    try {
      const res = await fetch(`/api/reset?key=${encodeURIComponent(rawKey)}`, {
        method: 'POST',
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || `failed (${res.status})`)
      setMsg(`Deleted ${body.deleted} response(s). Reloading...`)
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      setMsg(`Could not clear data: ${err.message}`)
      setBusy(false)
    }
  }

  return (
    <section className="dash-section danger-zone">
      <h2>Danger zone</h2>
      <p>
        Clear every stored response to start the real run with clean data. This
        is permanent and cannot be undone.
      </p>
      <button className="danger-btn" onClick={clearAll} disabled={busy}>
        {busy ? 'Clearing...' : 'Clear all responses'}
      </button>
      {msg && <p className="danger-msg">{msg}</p>}
    </section>
  )
}

function Shell({ children }) {
  return (
    <div className="dash">
      <div className="dash-inner">{children}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="dash-section">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

function pct(n, total) {
  if (!total) return '0%'
  return Math.round((n / total) * 100) + '%'
}

function ChoiceSplit({ name, rows }) {
  const a = rows.filter((r) => r.initialChoice === 'A').length
  const b = rows.filter((r) => r.initialChoice === 'B').length
  const total = a + b
  return (
    <div className="seg-card">
      <h3>{name}</h3>
      <Bar label="A · Rate Shield" value={a} total={total} suffix={pct(a, total)} />
      <Bar label="B · Treasure Chest" value={b} total={total} suffix={pct(b, total)} color="#b07c00" />
      <p className="seg-meta">n = {total}</p>
    </div>
  )
}

function FlipHistogram({ name, rows }) {
  const aRows = rows.filter((r) => r.initialChoice === 'A')
  const counts = FLIP_BUCKETS.map(
    (v) => aRows.filter((r) => !r.neverFlipped && Number(r.flipThreshold) === v).length
  )
  const never = aRows.filter((r) => r.neverFlipped).length
  const max = Math.max(1, ...counts, never)

  return (
    <div className="seg-card">
      <h3>{name}</h3>
      {FLIP_BUCKETS.map((v, i) => {
        const inBand = v >= BUDGET_BAND[0] && v <= BUDGET_BAND[1]
        return (
          <Bar
            key={v}
            label={fmt(v)}
            value={counts[i]}
            total={max}
            suffix={String(counts[i])}
            inBand={inBand}
          />
        )
      })}
      <Bar label="never flips" value={never} total={max} suffix={String(never)} color="#888" />
      <p className="seg-meta">n = {aRows.length} chose A</p>
    </div>
  )
}

function FloorHistogram({ name, rows }) {
  const bRows = rows.filter((r) => r.initialChoice === 'B')
  const counts = FLOOR_BUCKETS.map(
    (v) => bRows.filter((r) => !r.neverFlipped && Number(r.flipThreshold) === v).length
  )
  const never = bRows.filter((r) => r.neverFlipped).length
  const max = Math.max(1, ...counts, never)

  return (
    <div className="seg-card">
      <h3>{name}</h3>
      {FLOOR_BUCKETS.map((v, i) => (
        <Bar
          key={v}
          label={v === 0 ? '$0 (took it all)' : fmt(v)}
          value={counts[i]}
          total={max}
          suffix={String(counts[i])}
          color="#b07c00"
        />
      ))}
      <Bar
        label="never switches back"
        value={never}
        total={max}
        suffix={String(never)}
        color="#888"
      />
      <p className="seg-meta">n = {bRows.length} chose B</p>
    </div>
  )
}

function BarrierBreakdown({ name, rows, highlightDontWant }) {
  const counts = BARRIERS.map((bk) => rows.filter((r) => r.barrier === bk.key).length)
  const total = counts.reduce((a, b) => a + b, 0)
  const maxCount = Math.max(...counts, 0)
  const dontWantIdx = BARRIERS.findIndex((b) => b.key === 'dont_want')
  const dontWantIsPlurality =
    maxCount > 0 && counts[dontWantIdx] === maxCount

  return (
    <div className="seg-card">
      <h3>{name}</h3>
      {BARRIERS.map((bk, i) => {
        const flag = highlightDontWant && bk.key === 'dont_want' && dontWantIsPlurality
        return (
          <Bar
            key={bk.key}
            label={bk.label}
            value={counts[i]}
            total={total || 1}
            suffix={`${counts[i]} (${pct(counts[i], total)})`}
            color={bk.key === 'dont_want' ? '#c0392b' : undefined}
            flag={flag}
          />
        )
      })}
      {highlightDontWant && dontWantIsPlurality && (
        <p className="kill-flag">
          ⚠ "Don't want to move" is the plurality barrier for locked-in movers.
        </p>
      )}
      <p className="seg-meta">n = {total}</p>
    </div>
  )
}

function Bar({ label, value, total, suffix, color, inBand, flag }) {
  const width = total ? Math.round((value / total) * 100) : 0
  return (
    <div className={`bar-row ${inBand ? 'bar-row--band' : ''} ${flag ? 'bar-row--flag' : ''}`}>
      <span className="bar-label">{label}</span>
      <span className="bar-track">
        <span
          className="bar-fill"
          style={{ width: `${width}%`, background: color || '#3a7d5d' }}
        />
      </span>
      <span className="bar-suffix">{suffix}</span>
    </div>
  )
}
