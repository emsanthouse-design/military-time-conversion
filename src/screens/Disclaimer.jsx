import { Skyline } from '../components/Skyline.jsx'
import { Stars } from '../components/Juice.jsx'

// Screen 0 / title. Cannot be skipped: the only way forward is PRESS START.
// Disclaimer copy is VERBATIM per the spec. Do not punch it up.
export default function Disclaimer({ onStart }) {
  return (
    <section className="screen screen--center disclaimer">
      <Stars />
      <p className="kicker">A hero's journey through the Realm of Bostonia</p>
      <h1 className="title-blink">RATE QUEST</h1>

      <div className="title-skyline">
        <Skyline height={110} />
      </div>

      <p className="disclaimer__lead">
        A research game by a Boston University graduate student team.
      </p>
      <p className="disclaimer__body">
        This is a class project for an MBA design course, not a real product or
        offer. Nothing here is financial advice, and nobody will contact you. We
        collect your anonymous answers (no name, no email, no contact info) to
        understand how homeowners think about moving. Takes about 90 seconds.
      </p>
      <button className="btn btn--primary btn--big" onClick={onStart}>
        PRESS START
      </button>
    </section>
  )
}
