import { useState } from 'react'
import { Chest } from '../components/Sprites.jsx'
import { CoinBurst, Stars } from '../components/Juice.jsx'

// Screen 3, "The Treasure Trial". Branches on the Screen 2 choice.
//
// A (kept the rate): the hoard GROWS. We record the dollar value where they flip
//   and claim the gold, or neverFlipped=true if they hold out to the end.
// B (took the gold):  the hoard DWINDLES. We record the floor where they switch
//   back to keeping their rate, or neverFlipped=true if they ride it to $0.
//
// In both branches flipThreshold is "the dollar amount on screen when they
// changed their mind."

const GROW_STEPS = [25000, 50000, 75000, 100000, 150000]
const GROW_FLOURISH = [
  'The hoard grows...',
  'The hoard GLOWS...',
  'The hoard RUMBLES...',
  'The hoard OVERFLOWS...',
  'The hoard is the stuff of LEGEND...',
]

const SHRINK_STEPS = [7500, 5000, 2500, 1000, 0]
const SHRINK_FLOURISH = [
  'The hoard dwindles...',
  'The gold fades...',
  'The glow dims...',
  'Almost spent...',
  'The chest lies BARE...',
]

const fmt = (n) => '$' + n.toLocaleString('en-US')

export default function Escalator({ initialChoice, onDone }) {
  const grow = initialChoice === 'A'
  const steps = grow ? GROW_STEPS : SHRINK_STEPS
  const flourish = grow ? GROW_FLOURISH : SHRINK_FLOURISH
  const [i, setI] = useState(0)

  const amount = steps[i]
  // Scale the chest with progress: bigger as it grows, smaller as it dwindles.
  const scale = grow ? 0.8 + i * 0.16 : 1.25 - i * 0.18

  const advance = () => {
    if (i < steps.length - 1) {
      setI(i + 1)
    } else {
      // Held out to the end without changing their mind.
      onDone({ flipThreshold: null, neverFlipped: true })
    }
  }

  // Record the amount currently on screen at the moment they change their mind.
  const changeMind = () => {
    onDone({ flipThreshold: amount, neverFlipped: false })
  }

  return (
    <section className="screen screen--center escalator">
      <Stars />
      <p className="escalator__flourish">{flourish[i]}</p>

      <div className="escalator__art shake-on-change" key={i} style={{ '--chest-scale': scale }}>
        <CoinBurst trigger={i} count={grow ? 10 : 6} />
        <Chest px={150} glow={grow} open={grow && i >= 3} />
      </div>

      <div className="escalator__amount">{fmt(amount)}</div>
      <p className="escalator__sub">
        {grow ? 'in gold, toward your next stronghold' : 'in gold, going once...'}
      </p>

      <div className="escalator__btns">
        {grow ? (
          <>
            <button className="btn btn--ghost" onClick={advance}>
              STILL KEEPING MY RATE
            </button>
            <button className="btn btn--gold" onClick={changeMind}>
              CLAIM THE GOLD
            </button>
          </>
        ) : (
          <>
            <button className="btn btn--gold" onClick={advance}>
              STILL TAKING THE GOLD
            </button>
            <button className="btn btn--ghost" onClick={changeMind}>
              KEEP MY RATE INSTEAD
            </button>
          </>
        )}
      </div>
    </section>
  )
}
