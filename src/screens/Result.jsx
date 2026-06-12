import { Trophy } from '../components/Sprites.jsx'

const fmt = (n) => '$' + Number(n).toLocaleString('en-US')

// Screen 5. Title is assigned from initial choice + flip behavior.
function resultFor(run) {
  const { initialChoice, neverFlipped, flipThreshold } = run
  if (initialChoice === 'A') {
    if (neverFlipped) {
      return { title: 'RATE CLINGER', blurb: 'No chest is big enough.' }
    }
    return { title: 'PRICE HAS A NUMBER', blurb: `You flip at ${fmt(flipThreshold)}.` }
  }
  // Chose B
  if (neverFlipped) {
    return { title: 'READY MOVER', blurb: "You'd leave for free." }
  }
  return { title: 'BARGAIN HUNTER', blurb: `Your floor is ${fmt(flipThreshold)}.` }
}

const HOME_LABEL = { cozy: 'Cozy', just_right: 'Just right', too_big: 'Too big' }
const BARRIER_LABEL = {
  rate: 'My mortgage rate',
  costs: 'Costs and fees',
  hassle: 'The hassle',
  dont_want: "Don't want to move",
}

export default function Result({ run, onRestart }) {
  const { title, blurb } = resultFor(run)

  const share = async () => {
    const text = `I'm a ${title} in Rate Quest. ${blurb} Play this 90-second research game:`
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
      <Trophy px={150} />
      <h2 className="result__title">{title}</h2>
      <p className="result__blurb">{blurb}</p>

      <ul className="result__stats">
        <li>
          <span>RATE</span>
          {run.rate.toFixed(2)}%
        </li>
        <li>
          <span>HOME</span>
          {HOME_LABEL[run.homeSize] || '-'}
        </li>
        <li>
          <span>MOVE WISH</span>
          {'♥'.repeat(run.moveDesire)}
        </li>
        <li>
          <span>BARRIER</span>
          {BARRIER_LABEL[run.barrier] || '-'}
        </li>
      </ul>

      <button className="btn btn--primary btn--big" onClick={share}>
        SHARE WITH ANOTHER HOMEOWNER
      </button>
      <button className="btn btn--ghost" onClick={onRestart}>
        PLAY AGAIN
      </button>

      <p className="result__disclosure">
        BU grad research game. Anonymous. Not a real offer.
      </p>
    </section>
  )
}
