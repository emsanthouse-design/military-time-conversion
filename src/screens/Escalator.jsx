import { useState } from 'react'
import { Chest } from '../components/Sprites.jsx'

// Screen 3. Branches on the Screen 2 choice.
//
// A (kept the rate): the chest GROWS. We record the dollar value where they flip
//   and take the deal, or neverFlipped=true if they ride it to the end.
// B (took the cash):  the chest SHRINKS. We record the floor where they switch
//   back to keeping their rate, or neverFlipped=true if they take cash to $0.
//
// In both branches flipThreshold is "the dollar amount on screen when they
// changed their mind."

const GROW_STEPS = [25000, 50000, 75000, 100000, 150000]
const GROW_FLOURISH = [
  'The chest grows...',
  'The chest GLOWS...',
  'The chest RUMBLES...',
  'The chest OVERFLOWS...',
  'The chest is COLOSSAL...',
]

const SHRINK_STEPS = [7500, 5000, 2500, 1000, 0]
const SHRINK_FLOURISH = [
  'The chest shrinks...',
  'The coins fade...',
  'The glow dims...',
  'Almost empty...',
  'The chest is BARE...',
]

const fmt = (n) => '$' + n.toLocaleString('en-US')

export default function Escalator({ initialChoice, onDone }) {
  const grow = initialChoice === 'A'
  const steps = grow ? GROW_STEPS : SHRINK_STEPS
  const flourish = grow ? GROW_FLOURISH : SHRINK_FLOURISH
  const [i, setI] = useState(0)

  const amount = steps[i]
  // Scale the chest art with progress: bigger as it grows, smaller as it shrinks.
  const scale = grow ? 0.8 + i * 0.16 : 1.25 - i * 0.18

  // "Keep going down the escalator" button.
  const advance = () => {
    if (i < steps.length - 1) {
      setI(i + 1)
    } else {
      // Rode it to the end without changing their mind.
      onDone({ flipThreshold: null, neverFlipped: true })
    }
  }

  // "Change my mind now" button: record the amount currently on screen.
  const changeMind = () => {
    onDone({ flipThreshold: amount, neverFlipped: false })
  }

  return (
    <section className="screen screen--center escalator">
      <p className="escalator__flourish">{flourish[i]}</p>

      <div className="escalator__art" style={{ '--chest-scale': scale }}>
        <Chest px={150} glow={grow} />
      </div>

      <div className="escalator__amount">{fmt(amount)}</div>
      <p className="escalator__sub">
        {grow ? 'toward your next home' : 'cash, going once...'}
      </p>

      <div className="escalator__btns">
        {grow ? (
          <>
            <button className="btn btn--ghost" onClick={advance}>
              STILL KEEPING MY RATE
            </button>
            <button className="btn btn--gold" onClick={changeMind}>
              OK, TAKE THE DEAL
            </button>
          </>
        ) : (
          <>
            <button className="btn btn--gold" onClick={advance}>
              STILL TAKING THE CASH
            </button>
            <button className="btn btn--ghost" onClick={changeMind}>
              FINE, I'LL KEEP MY RATE
            </button>
          </>
        )}
      </div>
    </section>
  )
}
