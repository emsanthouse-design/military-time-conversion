import { Shield, Chest } from '../components/Sprites.jsx'

// Screen 2. Two cards, equal visual weight. The $10,000 anchor on Card B is
// deliberate and fixed. Do not randomize or hide it.
export default function Choice({ onChoose }) {
  return (
    <section className="screen screen--center choice">
      <h2 className="screen__title">Pick one</h2>
      <div className="cards">
        <button className="card card--a" onClick={() => onChoose('A')}>
          <div className="card__art">
            <Shield px={110} />
          </div>
          <h3 className="card__name">RATE SHIELD</h3>
          <p className="card__copy">
            Take your current rate with you to your next home. Same rate, new
            address.
          </p>
          <span className="card__cta">TAP TO CHOOSE</span>
        </button>

        <button className="card card--b" onClick={() => onChoose('B')}>
          <div className="card__art">
            <Chest px={120} />
          </div>
          <h3 className="card__name">TREASURE CHEST</h3>
          <p className="card__copy">
            Get $10,000 toward your next home purchase if you sell.
          </p>
          <span className="card__cta">TAP TO CHOOSE</span>
        </button>
      </div>
    </section>
  )
}
