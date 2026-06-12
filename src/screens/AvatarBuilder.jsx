import { Avatar, Castle } from '../components/Sprites.jsx'

// Screen 1. Every control maps to a stored segmentation field. Medieval flavor
// on the labels, but the underlying meaning (rate, household, size, tenure,
// move-desire) stays clear.
const HOUSEHOLD = [1, 2, 3, 4, '5+']
const HOMES = [
  { key: 'cozy', label: 'Turret', hint: 'small' },
  { key: 'just_right', label: 'Keep', hint: 'medium' },
  { key: 'too_big', label: 'Castle', hint: 'large' },
]
const TENURE = [
  { key: '<2', label: '< 2' },
  { key: '2-5', label: '2-5' },
  { key: '5-10', label: '5-10' },
  { key: '10+', label: '10+' },
]

// Move-desire callouts, indexed 1-5. Replaces the old hearts so it's clear what
// you're setting and which direction is "more".
const MOVE_LABELS = {
  1: 'Not really interested',
  2: 'Maybe someday',
  3: 'Thinking about it',
  4: 'Pretty motivated',
  5: 'Get me out of here!',
}

export default function AvatarBuilder({ run, patch, onNext }) {
  const ready =
    run.household !== null && run.homeSize !== null && run.tenure !== null

  return (
    <section className="screen builder">
      <h2 className="screen__title">Forge your hero</h2>

      <div className="field">
        <span className="field__label">Choose thy hero (pick your look)</span>
        <div className="face-grid">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              className={`pick ${run.face === i ? 'pick--on' : ''}`}
              aria-pressed={run.face === i}
              onClick={() => patch({ face: i })}
            >
              <Avatar index={i} size={64} selected={run.face === i} />
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">
          The enchantment on your hearth (your mortgage rate)
        </span>
        <div className="rate-readout">{run.rate.toFixed(2)}%</div>
        <input
          className="slider"
          type="range"
          min="2"
          max="8"
          step="0.25"
          value={run.rate}
          onChange={(e) => patch({ rate: Number(e.target.value) })}
          aria-label="Current mortgage rate"
        />
        <div className="slider__ends">
          <span>2.0%</span>
          <span>8.0%</span>
        </div>
      </div>

      <div className="field">
        <span className="field__label">Souls in your keep (people in your home)</span>
        <div className="chip-row">
          {HOUSEHOLD.map((h) => {
            const val = h === '5+' ? 5 : h
            return (
              <button
                key={h}
                className={`chip ${run.household === val ? 'chip--on' : ''}`}
                aria-pressed={run.household === val}
                onClick={() => patch({ household: val })}
              >
                {h}
              </button>
            )
          })}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Your stronghold (home size)</span>
        <div className="house-row">
          {HOMES.map((h) => (
            <button
              key={h.key}
              className={`house-pick ${run.homeSize === h.key ? 'house-pick--on' : ''}`}
              aria-pressed={run.homeSize === h.key}
              onClick={() => patch({ homeSize: h.key })}
            >
              <Castle size={h.key} px={72} selected={run.homeSize === h.key} />
              <span>{h.label}</span>
              <span className="house-pick__hint">{h.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Years sworn to this land (years you've lived here)</span>
        <div className="chip-row">
          {TENURE.map((t) => (
            <button
              key={t.key}
              className={`chip ${run.tenure === t.key ? 'chip--on' : ''}`}
              aria-pressed={run.tenure === t.key}
              onClick={() => patch({ tenure: t.key })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">
          How strongly does the road call you onward? (wanting to move)
        </span>
        <div className="move-readout">{MOVE_LABELS[run.moveDesire]}</div>
        <input
          className="slider"
          type="range"
          min="1"
          max="5"
          step="1"
          value={run.moveDesire}
          onChange={(e) => patch({ moveDesire: Number(e.target.value) })}
          aria-label="How much you want to move, 1 to 5"
        />
        <div className="slider__ends">
          <span>not really interested</span>
          <span>get me out of here!</span>
        </div>
      </div>

      <button
        className="btn btn--primary btn--big sticky-next"
        disabled={!ready}
        onClick={onNext}
      >
        {ready ? 'BEGIN THE QUEST' : 'CHOOSE KEEP, STRONGHOLD & YEARS'}
      </button>
    </section>
  )
}
