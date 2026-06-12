import { Crown } from '../components/Sprites.jsx'
import { CoinShower, Stars } from '../components/Juice.jsx'

const fmt = (n) => '$' + Number(n).toLocaleString('en-US')

// Screen 5. Title is assigned from initial choice + flip behavior, reskinned as
// a hero's epithet. The underlying logic is unchanged.
function resultFor(run) {
  const { initialChoice, neverFlipped, flipThreshold } = run
  if (initialChoice === 'A') {
    if (neverFlipped) {
      return { title: 'THE STEADFAST', blurb: 'No hoard is large enough.' }
    }
    return { title: 'EVERY HERO HAS A PRICE', blurb: `Your price: ${fmt(flipThreshold)} in gold.` }
  }
  // Chose B
  if (neverFlipped) {
    return { title: 'THE WANDERER', blurb: "You'd ride out for free." }
  }
  return { title: 'THE HAGGLER', blurb: `Your floor: ${fmt(flipThreshold)} in gold.` }
}

const HOME_LABEL = { cozy: 'Turret', just_right: 'Keep', too_big: 'Castle' }
const BARRIER_LABEL = {
  rate: 'My mortgage rate',
  costs: 'Costs and fees',
  hassle: 'The hassle',
  dont_want: "Don't want to move",
}

export default function Result({ run, onRestart }) {
  const { title, blurb } = resultFor(run)

  const share = async () => {
    const text = `My legend in Rate Quest: ${title}. ${blurb} Take the 90-second quest:`
    const url = window.location.origin
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Rate Quest', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      alert('Copied to clipboard. Share it with another homeowner.')
    } catch {
      // User dismissed the share sheet, or clipboard blocked. Nothing to do.
    }
  }

  return (
    <section className="screen screen--center result">
      <Stars />
      <CoinShower />
      <Crown px={150} />
      <h2 className="result__title">{title}</h2>
      <p className="result__blurb">{blurb}</p>

      <ul className="result__stats">
        <li>
          <span>HEARTH RATE</span>
          {run.rate.toFixed(2)}%
        </li>
        <li>
          <span>STRONGHOLD</span>
          {HOME_LABEL[run.homeSize] || '-'}
        </li>
        <li>
          <span>WANDERLUST</span>
          {'♥'.repeat(run.moveDesire)}
        </li>
        <li>
          <span>WHAT BINDS YOU</span>
          {BARRIER_LABEL[run.barrier] || '-'}
        </li>
      </ul>

      <button className="btn btn--primary btn--big" onClick={share}>
        SHARE WITH ANOTHER HOMEOWNER
      </button>
      <button className="btn btn--ghost" onClick={onRestart}>
        NEW QUEST
      </button>

      <p className="result__disclosure">
        BU grad research game. Anonymous. Not a real offer.
      </p>
    </section>
  )
}
