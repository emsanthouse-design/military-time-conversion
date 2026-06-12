import { Stars } from '../components/Juice.jsx'

// Screen 4. One forced-choice question. The fourth answer ("I don't want to
// move") is a kill-condition measure and is styled exactly like the others. Do
// not bury it. Medieval flavor on the headline only; each option keeps a plain,
// unambiguous label so the research data stays clean. Storing the run happens
// right after this pick (in App.submit).
const OPTIONS = [
  { key: 'rate', icon: '✦', label: 'My mortgage rate' },
  { key: 'costs', icon: '⚖', label: 'The costs and fees of selling' },
  { key: 'hassle', icon: '⛬', label: 'The hassle of moving' },
  { key: 'dont_want', icon: '⌂', label: "Honestly, I don't want to move" },
]

export default function Barrier({ onPick }) {
  return (
    <section className="screen screen--center barrier">
      <Stars />
      <h2 className="screen__title">Speak true, hero</h2>
      <p className="screen__sub">What's REALLY keeping you in your current home?</p>
      <div className="barrier__grid">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            className="barrier__btn"
            onClick={() => onPick(o.key)}
          >
            <span className="barrier__icon" aria-hidden="true">
              {o.icon}
            </span>
            <span className="barrier__label">{o.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
