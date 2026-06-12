// The Realm of Bostonia skyline: real Boston landmarks reimagined as a medieval
// castle-city, drawn as inline pixel art on a wide 96x32 grid.
//
// Landmark -> medieval translation:
//   Custom House Tower  -> the wizard's clock spire (tall tower with a clock)
//   Zakim Bridge        -> the twin-tower castle gate with hanging chains
//   Fenway Green Monster-> the emerald castle wall (green wall + scoreboard runes)
//   Bunker Hill obelisk -> the stone obelisk
//   Citgo sign          -> a glowing rune in the sky
//   ...all under a pixel moon and stars.
export function Skyline({ height = 120 }) {
  const STONE = '#7d8aa0'
  const STONE_D = '#5a6577'
  const EMERALD = '#2bb56a'
  const GOLD = '#f6c945'
  const ROOF = '#c84b4b'
  const WIN = '#ffe27a'
  const RUNE = '#ff6b5e'

  const cells = [
    // ground line
    { x: 0, y: 30, w: 96, h: 2, c: '#16263a' },

    // --- Fenway "Green Monster" wall (far left) ---
    { x: 2, y: 20, w: 16, h: 10, c: EMERALD },
    { x: 2, y: 19, w: 1, h: 1, c: EMERALD },
    { x: 5, y: 19, w: 1, h: 1, c: EMERALD },
    { x: 8, y: 19, w: 1, h: 1, c: EMERALD },
    { x: 11, y: 19, w: 1, h: 1, c: EMERALD },
    { x: 14, y: 19, w: 1, h: 1, c: EMERALD },
    { x: 17, y: 19, w: 1, h: 1, c: EMERALD },
    { x: 5, y: 23, w: 9, h: 3, c: '#0d1b2a' }, // scoreboard
    { x: 6, y: 24, w: 1, h: 1, c: WIN },
    { x: 8, y: 24, w: 1, h: 1, c: WIN },
    { x: 10, y: 24, w: 1, h: 1, c: WIN },
    { x: 12, y: 24, w: 1, h: 1, c: WIN },

    // --- Bunker Hill obelisk ---
    { x: 23, y: 8, w: 3, h: 22, c: STONE },
    { x: 23, y: 8, w: 1, h: 22, c: STONE_D },
    { x: 23, y: 6, w: 3, h: 2, c: STONE }, // capstone
    { x: 24, y: 5, w: 1, h: 1, c: STONE },

    // --- Custom House wizard clock spire (center, tallest) ---
    { x: 40, y: 4, w: 8, h: 26, c: STONE },
    { x: 40, y: 4, w: 1, h: 26, c: STONE_D },
    { x: 40, y: 2, w: 8, h: 2, c: ROOF }, // pointed cap base
    { x: 42, y: 0, w: 4, h: 2, c: ROOF },
    { x: 43, y: 8, w: 2, h: 2, c: GOLD }, // the clock
    { x: 44, y: 8, w: 1, h: 1, c: '#0d1b2a' },
    { x: 41, y: 14, w: 1, h: 1, c: WIN },
    { x: 46, y: 14, w: 1, h: 1, c: WIN },
    { x: 41, y: 20, w: 1, h: 1, c: WIN },
    { x: 46, y: 20, w: 1, h: 1, c: WIN },

    // small keep between
    { x: 31, y: 18, w: 6, h: 12, c: STONE },
    { x: 31, y: 16, w: 1, h: 1, c: STONE },
    { x: 33, y: 16, w: 1, h: 1, c: STONE },
    { x: 35, y: 16, w: 1, h: 1, c: STONE },
    { x: 33, y: 21, w: 2, h: 2, c: WIN },

    // --- Zakim twin-tower castle gate (right) ---
    { x: 60, y: 6, w: 3, h: 24, c: STONE }, // left pylon
    { x: 60, y: 4, w: 3, h: 2, c: STONE },
    { x: 61, y: 2, w: 1, h: 2, c: STONE },
    { x: 70, y: 6, w: 3, h: 24, c: STONE }, // right pylon
    { x: 70, y: 4, w: 3, h: 2, c: STONE },
    { x: 71, y: 2, w: 1, h: 2, c: STONE },
    { x: 63, y: 10, w: 7, h: 1, c: STONE_D }, // top cable/beam
    { x: 63, y: 22, w: 7, h: 8, c: '#3a2a18' }, // the gate
    { x: 64, y: 23, w: 1, h: 7, c: '#5a3a20' },
    { x: 66, y: 23, w: 1, h: 7, c: '#5a3a20' },
    { x: 68, y: 23, w: 1, h: 7, c: '#5a3a20' },

    // far-right turret
    { x: 80, y: 14, w: 5, h: 16, c: STONE },
    { x: 80, y: 12, w: 1, h: 1, c: STONE },
    { x: 82, y: 12, w: 1, h: 1, c: STONE },
    { x: 84, y: 12, w: 1, h: 1, c: STONE },
    { x: 81, y: 18, w: 3, h: 2, c: WIN },
    { x: 88, y: 22, w: 4, h: 8, c: STONE },
    { x: 88, y: 20, w: 4, h: 2, c: ROOF },

    // --- sky: moon, stars, and the Citgo rune ---
    { x: 8, y: 4, w: 4, h: 4, c: '#f6f5f0' }, // moon
    { x: 7, y: 5, w: 1, h: 2, c: '#f6f5f0' },
    { x: 12, y: 5, w: 1, h: 2, c: '#f6f5f0' },
    { x: 9, y: 4, w: 2, h: 1, c: '#cdd2dc' }, // crescent shadow
    { x: 54, y: 9, w: 3, h: 3, c: RUNE }, // Citgo rune
    { x: 55, y: 8, w: 1, h: 1, c: RUNE },
    { x: 55, y: 12, w: 1, h: 1, c: RUNE },
    { x: 54, y: 10, w: 3, h: 1, c: '#ffd0c9' },
    { x: 18, y: 3, w: 1, h: 1, c: '#f6f5f0' }, // stars
    { x: 30, y: 6, w: 1, h: 1, c: '#f6f5f0' },
    { x: 50, y: 4, w: 1, h: 1, c: '#f6f5f0' },
    { x: 66, y: 4, w: 1, h: 1, c: '#f6f5f0' },
    { x: 78, y: 5, w: 1, h: 1, c: '#f6f5f0' },
    { x: 90, y: 7, w: 1, h: 1, c: '#f6f5f0' },
  ]

  return (
    <svg
      viewBox="0 0 96 32"
      height={height}
      width="100%"
      className="skyline"
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label="The medieval skyline of the Realm of Bostonia"
    >
      {cells.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
      ))}
    </svg>
  )
}
