import { Shield, Chest } from '../components/Sprites.jsx'
import { Stars } from '../components/Juice.jsx'

// Screen 2. Two paths, equal visual weight. The $10,000 anchor on the hoard is
// deliberate and fixed. Do not randomize or hide it.
export default function Choice({ onChoose }) {
  return (
    <section className="screen screen--center choice">
      <Stars />
      <h2 className="screen__title">The crossroads</h2>
      <p className="screen__sub">Two paths lie before you, hero. Choose one.</p>
      <div className="cards">
        <button className="card card--a" onClick={() => onChoose('A')}>
          <div className="card__art">
            <Shield px={110} />
          </div>
          <h3 className="card__name">RATE SHIELD</h3>
          <p className="card__copy">
            Carry your hearth enchantment to your next stronghold. Same rate, new
            castle.
          </p>
          <span className="card__cta">TAKE THIS PATH</span>
        </button>

        <button className="card card--b" onClick={() => onChoose('B')}>
          <div className="card__art">
            <Chest px={120} glow />
          </div>
          <h3 className="card__name">DRAGON'S HOARD</h3>
          <p className="card__copy">
            $10,000 in gold toward your next stronghold if you sell.
          </p>
          <span className="card__cta">TAKE THIS PATH</span>
        </button>
      </div>
    </section>
  )
}
