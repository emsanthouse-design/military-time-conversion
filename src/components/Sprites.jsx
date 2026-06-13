// Inline SVG pixel art on a 16x16 grid. No external assets.
// Each face is a list of {x, y, w?, h?, c} rectangles drawn at 1 unit = 1 pixel.

const SKIN = ['#f2c79b', '#e0a06b', '#c97f4a', '#8a5a36', '#f7d9c4', '#b5793f']
const HAIR = ['#3a2b1a', '#0d0d0d', '#8a5a1a', '#c0c0c0', '#6b3fa0', '#b5482f']

// Six little pixel people. Same head shape, different hair + palette so they read
// as different people with no gender labels.
const FACES = [
  { hair: 'short' },
  { hair: 'flat' },
  { hair: 'long' },
  { hair: 'spiky' },
  { hair: 'bun' },
  { hair: 'bald' },
]

function hairCells(style) {
  switch (style) {
    case 'short':
      return rect(4, 2, 8, 2).concat(rect(4, 4, 1, 2), rect(11, 4, 1, 2))
    case 'flat':
      return rect(4, 2, 8, 1)
    case 'long':
      return rect(4, 2, 8, 2).concat(rect(3, 4, 1, 7), rect(12, 4, 1, 7))
    case 'spiky':
      return [
        ...rect(4, 3, 8, 1),
        ...rect(4, 1, 1, 2),
        ...rect(6, 1, 1, 2),
        ...rect(8, 1, 1, 2),
        ...rect(10, 1, 1, 2),
      ]
    case 'bun':
      return rect(4, 3, 8, 1).concat(rect(7, 1, 2, 2))
    case 'bald':
    default:
      return []
  }
}

function rect(x, y, w = 1, h = 1) {
  return [{ x, y, w, h }]
}

export function Avatar({ index = 0, size = 96, selected = false }) {
  const face = FACES[index % FACES.length]
  const skin = SKIN[index % SKIN.length]
  const hair = HAIR[index % HAIR.length]

  const cells = []
  // Head
  cells.push(...rect(5, 4, 6, 7).map((r) => ({ ...r, c: skin })))
  // Neck + shoulders
  cells.push(...rect(6, 11, 4, 1).map((r) => ({ ...r, c: skin })))
  cells.push(...rect(4, 12, 8, 3).map((r) => ({ ...r, c: '#3a86c8' })))
  // Eyes
  cells.push({ x: 6, y: 7, w: 1, h: 1, c: '#0d0d0d' })
  cells.push({ x: 9, y: 7, w: 1, h: 1, c: '#0d0d0d' })
  // Mouth
  cells.push({ x: 7, y: 9, w: 2, h: 1, c: '#9c4a3a' })
  // Hair
  cells.push(...hairCells(face.hair).map((r) => ({ ...r, c: hair })))

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={`sprite ${selected ? 'sprite--selected' : ''}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Pixel person ${index + 1}`}
    >
      <rect x="0" y="0" width="16" height="16" fill="none" />
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// Three pixel houses of increasing size: cozy / just right / too big.
export function House({ size = 'just_right', px = 96, selected = false }) {
  const map = {
    cozy: { bodyW: 6, bodyH: 5, label: 'Small house' },
    just_right: { bodyW: 8, bodyH: 6, label: 'Medium house' },
    too_big: { bodyW: 11, bodyH: 8, label: 'Large house' },
  }
  const cfg = map[size] || map.just_right
  const w = cfg.bodyW
  const h = cfg.bodyH
  const x0 = Math.floor((16 - w) / 2)
  const y0 = 15 - h
  const roofY = y0 - Math.ceil(w / 2)

  const cells = []
  // Roof: stacked triangle of rows
  for (let i = 0; i < Math.ceil(w / 2); i++) {
    const rw = w - i * 2
    cells.push({ x: x0 + i, y: roofY + i, w: rw, h: 1, c: '#c84b4b' })
  }
  // Body
  cells.push({ x: x0, y: y0, w, h, c: '#f4e4c1' })
  // Door
  cells.push({ x: x0 + Math.floor(w / 2) - 1, y: 15 - 3, w: 2, h: 3, c: '#7a4a2a' })
  // Window(s)
  cells.push({ x: x0 + 1, y: y0 + 1, w: 1, h: 1, c: '#6fb7e0' })
  if (w >= 8) cells.push({ x: x0 + w - 2, y: y0 + 1, w: 1, h: 1, c: '#6fb7e0' })

  return (
    <svg
      viewBox="0 0 16 16"
      width={px}
      height={px}
      className={`sprite ${selected ? 'sprite--selected' : ''}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={cfg.label}
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// Dragon's hoard chest. `glow` adds a torch-light aura; `open` lifts the lid and
// spills gold for the "you struck treasure" moments.
export function Chest({ px = 140, glow = false, open = false }) {
  const body = [
    { x: 2, y: 7, w: 12, h: 6, c: '#8a5a1a' }, // body
    { x: 2, y: 12, w: 12, h: 1, c: '#5c3a10' }, // base shadow
    { x: 2, y: 7, w: 12, h: 1, c: '#f6c945' }, // gold band
  ]
  // When open, the gold inside is revealed and the lid tips up and back.
  const treasure = open
    ? [
        { x: 4, y: 6, w: 2, h: 2, c: '#ffe27a' },
        { x: 7, y: 5, w: 2, h: 3, c: '#ffe27a' },
        { x: 10, y: 6, w: 2, h: 2, c: '#ffe27a' },
        { x: 6, y: 4, w: 1, h: 1, c: '#fff4c2' },
        { x: 9, y: 4, w: 1, h: 1, c: '#fff4c2' },
      ]
    : []
  const lid = open
    ? [
        { x: 2, y: 2, w: 12, h: 3, c: '#a86a22' },
        { x: 2, y: 4, w: 12, h: 1, c: '#7a4a12' },
      ]
    : [
        { x: 2, y: 5, w: 12, h: 3, c: '#a86a22' },
        { x: 7, y: 8, w: 2, h: 3, c: '#f6c945' }, // lock plate
        { x: 7, y: 9, w: 2, h: 1, c: '#0d0d0d' }, // keyhole
      ]
  const cells = [...body, ...treasure, ...lid]
  return (
    <svg
      viewBox="0 0 16 16"
      width={px}
      height={px}
      className={`sprite chest ${glow ? 'chest--glow' : ''}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Treasure chest"
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// A single gold coin, used for bursts and showers.
export function Coin({ px = 16 }) {
  const cells = [
    { x: 5, y: 4, w: 6, h: 8, c: '#f6c945' },
    { x: 4, y: 6, w: 1, h: 4, c: '#f6c945' },
    { x: 11, y: 6, w: 1, h: 4, c: '#f6c945' },
    { x: 6, y: 5, w: 4, h: 6, c: '#ffe27a' },
    { x: 7, y: 6, w: 1, h: 4, c: '#b8860b' }, // engraved mark
  ]
  return (
    <svg viewBox="0 0 16 16" width={px} height={px} className="sprite" shapeRendering="crispEdges" aria-hidden="true">
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// Castle structures of increasing grandeur: cozy = lone turret, just_right = keep,
// too_big = full castle. Replaces the plain houses with the hero's-journey theme.
export function Castle({ size = 'just_right', px = 96, selected = false }) {
  const STONE = '#7d8aa0'
  const STONE_D = '#5a6577'
  const ROOF = '#c84b4b'
  const FLAG = '#3ddc84'
  const DOOR = '#3a2a18'
  const WIN = '#f6c945'

  let cells = []
  if (size === 'cozy') {
    // A single tall turret.
    cells = [
      { x: 6, y: 5, w: 4, h: 10, c: STONE },
      { x: 6, y: 5, w: 1, h: 10, c: STONE_D },
      { x: 6, y: 3, w: 1, h: 1, c: STONE }, // crenellations
      { x: 8, y: 3, w: 1, h: 1, c: STONE },
      { x: 6, y: 4, w: 4, h: 1, c: STONE },
      { x: 9, y: 1, w: 1, h: 3, c: '#6b3a1a' }, // flagpole
      { x: 10, y: 1, w: 2, h: 1, c: FLAG }, // flag
      { x: 7, y: 7, w: 2, h: 2, c: WIN },
      { x: 7, y: 11, w: 2, h: 4, c: DOOR },
    ]
  } else if (size === 'too_big') {
    // Full castle: central keep flanked by two towers, wall, gate.
    cells = [
      { x: 1, y: 8, w: 14, h: 7, c: STONE }, // wall
      { x: 1, y: 8, w: 14, h: 1, c: STONE_D },
      // left tower
      { x: 1, y: 4, w: 3, h: 5, c: STONE },
      { x: 1, y: 3, w: 1, h: 1, c: STONE },
      { x: 3, y: 3, w: 1, h: 1, c: STONE },
      // right tower
      { x: 12, y: 4, w: 3, h: 5, c: STONE },
      { x: 12, y: 3, w: 1, h: 1, c: STONE },
      { x: 14, y: 3, w: 1, h: 1, c: STONE },
      // central keep
      { x: 5, y: 2, w: 6, h: 7, c: STONE },
      { x: 5, y: 1, w: 1, h: 1, c: STONE },
      { x: 7, y: 1, w: 1, h: 1, c: STONE },
      { x: 9, y: 1, w: 1, h: 1, c: STONE },
      { x: 7, y: 0, w: 1, h: 1, c: '#6b3a1a' }, // flagpole
      { x: 8, y: 0, w: 2, h: 1, c: FLAG },
      // windows + gate
      { x: 2, y: 6, w: 1, h: 1, c: WIN },
      { x: 13, y: 6, w: 1, h: 1, c: WIN },
      { x: 7, y: 4, w: 2, h: 2, c: WIN },
      { x: 7, y: 11, w: 2, h: 4, c: DOOR },
      { x: 6, y: 11, w: 1, h: 1, c: DOOR },
      { x: 9, y: 11, w: 1, h: 1, c: DOOR },
    ]
  } else {
    // The keep: one solid stronghold with roof and flag.
    cells = [
      { x: 4, y: 6, w: 8, h: 9, c: STONE },
      { x: 4, y: 6, w: 1, h: 9, c: STONE_D },
      { x: 4, y: 5, w: 1, h: 1, c: STONE },
      { x: 6, y: 5, w: 1, h: 1, c: STONE },
      { x: 8, y: 5, w: 1, h: 1, c: STONE },
      { x: 10, y: 5, w: 1, h: 1, c: STONE },
      { x: 3, y: 3, w: 10, h: 3, c: ROOF }, // pitched roof band
      { x: 4, y: 2, w: 8, h: 1, c: ROOF },
      { x: 8, y: 0, w: 1, h: 2, c: '#6b3a1a' }, // flagpole
      { x: 9, y: 0, w: 2, h: 1, c: FLAG },
      { x: 6, y: 8, w: 2, h: 2, c: WIN },
      { x: 9, y: 8, w: 1, h: 1, c: WIN },
      { x: 7, y: 11, w: 2, h: 4, c: DOOR },
    ]
  }

  return (
    <svg
      viewBox="0 0 16 16"
      width={px}
      height={px}
      className={`sprite ${selected ? 'sprite--selected' : ''}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`${size} castle`}
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// Simple pixel shield for Card A.
export function Shield({ px = 120 }) {
  const cells = [
    { x: 4, y: 2, w: 8, h: 1, c: '#3ddc84' },
    { x: 3, y: 3, w: 10, h: 6, c: '#3ddc84' },
    { x: 4, y: 9, w: 8, h: 2, c: '#2bb56a' },
    { x: 6, y: 11, w: 4, h: 2, c: '#2bb56a' },
    { x: 7, y: 13, w: 2, h: 1, c: '#1f8e52' },
    { x: 7, y: 5, w: 2, h: 4, c: '#f6f5f0' }, // checkmark stem
    { x: 5, y: 7, w: 2, h: 2, c: '#f6f5f0' }, // checkmark foot
  ]
  return (
    <svg
      viewBox="0 0 16 16"
      width={px}
      height={px}
      className="sprite"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Shield"
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// A rolled parchment scroll, for the herald's-message story beat.
export function Scroll({ px = 120 }) {
  const PARCH = '#f0e2bd'
  const ROLL = '#cdb88a'
  const INK = '#9c8a5a'
  const cells = [
    { x: 4, y: 3, w: 8, h: 10, c: PARCH },
    { x: 3, y: 2, w: 10, h: 2, c: ROLL },
    { x: 3, y: 12, w: 10, h: 2, c: ROLL },
    { x: 5, y: 5, w: 6, h: 1, c: INK },
    { x: 5, y: 7, w: 6, h: 1, c: INK },
    { x: 5, y: 9, w: 4, h: 1, c: INK },
  ]
  return (
    <svg viewBox="0 0 16 16" width={px} height={px} className="sprite" shapeRendering="crispEdges" role="img" aria-label="Scroll">
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// The Oracle's crystal orb on a stand.
export function Orb({ px = 120 }) {
  const cells = [
    { x: 5, y: 12, w: 6, h: 2, c: '#6b3a1a' }, // base
    { x: 4, y: 11, w: 1, h: 1, c: '#6b3a1a' },
    { x: 11, y: 11, w: 1, h: 1, c: '#6b3a1a' },
    { x: 5, y: 4, w: 6, h: 7, c: '#6fb7e0' }, // orb
    { x: 4, y: 6, w: 1, h: 3, c: '#6fb7e0' },
    { x: 11, y: 6, w: 1, h: 3, c: '#6fb7e0' },
    { x: 6, y: 5, w: 2, h: 2, c: '#cfeefc' }, // highlight
    { x: 8, y: 8, w: 1, h: 1, c: '#ffffff' }, // sparkle
  ]
  return (
    <svg viewBox="0 0 16 16" width={px} height={px} className="sprite chest--glow" shapeRendering="crispEdges" role="img" aria-label="Crystal orb">
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// Royal crown for the result screen (replaces the trophy in the medieval theme).
export function Crown({ px = 160 }) {
  const GOLD = '#f6c945'
  const GOLD_D = '#d8a92f'
  const cells = [
    { x: 3, y: 9, w: 10, h: 3, c: GOLD }, // band
    { x: 3, y: 11, w: 10, h: 1, c: GOLD_D },
    { x: 3, y: 4, w: 1, h: 5, c: GOLD }, // left peak
    { x: 12, y: 4, w: 1, h: 5, c: GOLD },
    { x: 7, y: 3, w: 2, h: 6, c: GOLD }, // center peak
    { x: 5, y: 6, w: 1, h: 3, c: GOLD }, // mid peaks
    { x: 10, y: 6, w: 1, h: 3, c: GOLD },
    { x: 3, y: 3, w: 1, h: 1, c: '#ff6b5e' }, // jewels
    { x: 12, y: 3, w: 1, h: 1, c: '#3ddc84' },
    { x: 7, y: 2, w: 2, h: 1, c: '#6fb7e0' },
    { x: 7, y: 10, w: 2, h: 1, c: '#ff6b5e' }, // center gem on band
  ]
  return (
    <svg
      viewBox="0 0 16 16"
      width={px}
      height={px}
      className="sprite trophy"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Crown"
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}

// Pixel trophy for the result screen.
export function Trophy({ px = 160 }) {
  const cells = [
    { x: 4, y: 2, w: 8, h: 4, c: '#f6c945' }, // cup
    { x: 3, y: 3, w: 1, h: 2, c: '#f6c945' }, // left handle
    { x: 12, y: 3, w: 1, h: 2, c: '#f6c945' }, // right handle
    { x: 5, y: 6, w: 6, h: 1, c: '#d8a92f' },
    { x: 7, y: 7, w: 2, h: 3, c: '#d8a92f' }, // stem
    { x: 5, y: 10, w: 6, h: 1, c: '#f6c945' }, // base top
    { x: 4, y: 11, w: 8, h: 2, c: '#a87f1f' }, // base
  ]
  return (
    <svg
      viewBox="0 0 16 16"
      width={px}
      height={px}
      className="sprite trophy"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Trophy"
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}
