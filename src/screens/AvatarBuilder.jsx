import { Avatar, House } from '../components/Sprites.jsx'

// Screen 1. Every control maps to a stored segmentation field.
const HOUSEHOLD = [1, 2, 3, 4, '5+']
const HOMES = [
  { key: 'cozy', label: 'Cozy' },
  { key: 'just_right', label: 'Just right' },
  { key: 'too_big', label: 'Too big' },
]
const TENURE = [
  { key: '<2', label: '< 2' },
  { key: '2-5', label: '2-5' },
  { key: '5-10', label: '5-10' },
  { key: '10+', label: '10+' },
]

export default function AvatarBuilder({ run, patch, onNext }) {
  const ready =
    run.household !== null && run.homeSize !== null && run.tenure !== null

  return (
    <section className="screen builder">
      <h2 className="screen__title">Build your homeowner</h2>

      <div className="field">
        <span className="field__label">Pick a face</span>
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
        <span className="field__label">Your current mortgage rate</span>
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
        <span className="field__label">People in your home</span>
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
        <span className="field__label">Your home</span>
        <div className="house-row">
          {HOMES.map((h) => (
            <button
              key={h.key}
              className={`house-pick ${run.homeSize === h.key ? 'house-pick--on' : ''}`}
              aria-pressed={run.homeSize === h.key}
              onClick={() => patch({ homeSize: h.key })}
            >
              <House size={h.key} px={72} selected={run.homeSize === h.key} />
              <span>{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Years you've lived there</span>
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
          How much do you want to move in the next few years?
        </span>
        <div className="heart-row" role="group" aria-label="Move desire, 1 to 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`heart ${run.moveDesire >= n ? 'heart--on' : ''}`}
              aria-pressed={run.moveDesire >= n}
              aria-label={`${n} of 5`}
              onClick={() => patch({ moveDesire: n })}
            >
              {run.moveDesire >= n ? '♥' : '♡'}
            </button>
          ))}
        </div>
        <div className="heart-hint">
          {run.moveDesire === 1 ? 'staying put' : run.moveDesire === 5 ? 'desperate to go' : ''}
        </div>
      </div>

      <button
        className="btn btn--primary btn--big sticky-next"
        disabled={!ready}
        onClick={onNext}
      >
        {ready ? 'NEXT' : 'PICK ALL THREE ABOVE'}
      </button>
    </section>
  )
}
