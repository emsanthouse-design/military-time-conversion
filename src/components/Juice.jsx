import { Coin } from './Sprites.jsx'

// All the "easy juice": coin bursts, coin showers, a starfield, and the quest
// progress map. Animations are CSS-driven (see styles.css) and are disabled
// under prefers-reduced-motion.

// A burst of coins flying outward. Give it a changing `trigger` to replay it.
export function CoinBurst({ trigger, count = 12 }) {
  const coins = Array.from({ length: count })
  return (
    <div className="coin-burst" key={trigger} aria-hidden="true">
      {coins.map((_, i) => {
        const angle = (360 / count) * i + (trigger % 30)
        const dist = 60 + ((i * 37) % 50)
        const dx = Math.round(Math.cos((angle * Math.PI) / 180) * dist)
        const dy = Math.round(Math.sin((angle * Math.PI) / 180) * dist)
        return (
          <span
            key={i}
            className="coin-burst__coin"
            style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--d': `${(i % 5) * 30}ms` }}
          >
            <Coin px={18} />
          </span>
        )
      })}
    </div>
  )
}

// Coins raining down from the top, for the victory screen.
export function CoinShower({ count = 22 }) {
  const coins = Array.from({ length: count })
  return (
    <div className="coin-shower" aria-hidden="true">
      {coins.map((_, i) => (
        <span
          key={i}
          className="coin-shower__coin"
          style={{
            left: `${(i * 53) % 100}%`,
            '--delay': `${(i % 10) * 220}ms`,
            '--dur': `${1800 + ((i * 130) % 1400)}ms`,
          }}
        >
          <Coin px={16} />
        </span>
      ))}
    </div>
  )
}

// A twinkling pixel starfield for screen backgrounds.
export function Stars({ count = 26 }) {
  const stars = Array.from({ length: count })
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((_, i) => (
        <span
          key={i}
          className="stars__dot"
          style={{
            left: `${(i * 39) % 100}%`,
            top: `${(i * 71) % 100}%`,
            '--twinkle': `${1400 + ((i * 90) % 2200)}ms`,
            '--tdelay': `${(i % 8) * 200}ms`,
          }}
        />
      ))}
    </div>
  )
}

