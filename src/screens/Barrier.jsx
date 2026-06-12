// Screen 4. One forced-choice question. The fourth answer ("I don't want to
// move") is a kill-condition measure and is styled exactly like the others. Do
// not bury it. Storing the run happens right after this pick (in App.submit).
const OPTIONS = [
  { key: 'rate', icon: '%', label: 'My mortgage rate' },
  { key: 'costs', icon: '$', label: 'The costs and fees of selling' },
  { key: 'hassle', icon: '▤', label: 'The hassle of moving' },
  { key: 'dont_want', icon: '⌂', label: "Honestly, I don't want to move" },
]

export default function Barrier({ onPick }) {
  return (
    <section className="screen screen--center barrier">
      <h2 className="screen__title">
        What's REALLY keeping you in your current home?
      </h2>
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
