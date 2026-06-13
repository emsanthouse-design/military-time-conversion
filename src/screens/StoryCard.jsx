import { useEffect, useRef, useState } from 'react'
import { Stars } from '../components/Juice.jsx'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A full-screen narrative beat between gameplay stages. Classic RPG typewriter
// text primes the upcoming decision. First tap reveals all text; once fully
// shown, the button advances. Reduced motion shows the full text immediately.
export default function StoryCard({ art, kicker, title, lines, cta = 'CONTINUE', onNext }) {
  const full = lines.join('\n')
  const reduce = prefersReducedMotion()
  const [shown, setShown] = useState(reduce ? full.length : 0)
  const timer = useRef(null)
  const done = shown >= full.length

  useEffect(() => {
    if (reduce) {
      setShown(full.length)
      return
    }
    setShown(0)
    let i = 0
    timer.current = setInterval(() => {
      i += 1
      setShown(i)
      if (i >= full.length) clearInterval(timer.current)
    }, 26)
    return () => clearInterval(timer.current)
  }, [full, reduce])

  const handle = () => {
    if (!done) {
      clearInterval(timer.current)
      setShown(full.length) // first tap: reveal everything
    } else {
      onNext()
    }
  }

  return (
    <section className="screen screen--center story">
      <Stars />
      <div className="story__art">{art}</div>
      {kicker && <p className="story__kicker">{kicker}</p>}
      <h2 className="story__title">{title}</h2>
      <div className="story__panel" onClick={!done ? handle : undefined}>
        <p className="story__text">
          {full.slice(0, shown)}
          {!done && <span className="story__caret">▌</span>}
        </p>
      </div>
      <button className="btn btn--primary btn--big" onClick={handle}>
        {done ? cta : 'SKIP ▶'}
      </button>
    </section>
  )
}
