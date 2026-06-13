import { useState } from 'react'
import Disclaimer from './screens/Disclaimer.jsx'
import AvatarBuilder from './screens/AvatarBuilder.jsx'
import Choice from './screens/Choice.jsx'
import Escalator from './screens/Escalator.jsx'
import Barrier from './screens/Barrier.jsx'
import Result from './screens/Result.jsx'
import StoryCard from './screens/StoryCard.jsx'
import { Castle, Scroll, Chest, Orb } from './components/Sprites.jsx'

// The journey alternates gameplay screens with short animated story beats that
// set up each choice. Steps:
//   0 title  1 story:intro  2 builder  3 story:herald  4 choice
//   5 story:trial  6 escalator  7 story:oracle  8 barrier(submit)  9 result
const STORE_ENDPOINT = '/api/respond'

const emptyRun = {
  face: 0,
  rate: 3.0,
  household: null,
  homeSize: null,
  tenure: null,
  moveDesire: 3,
  initialChoice: null,
  flipThreshold: null,
  neverFlipped: false,
  barrier: null,
}

export default function App() {
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(emptyRun)

  const patch = (fields) => setRun((r) => ({ ...r, ...fields }))
  const next = () => setStep((s) => s + 1)

  // Called from the barrier screen. Writes the one-and-only record, then advances
  // to the result. Storage failures should not block the player from their result.
  const submit = async (finalFields) => {
    const finished = { ...run, ...finalFields }
    setRun(finished)
    next()
    try {
      await fetch(STORE_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          rate: finished.rate,
          household: finished.household,
          homeSize: finished.homeSize,
          tenure: finished.tenure,
          moveDesire: finished.moveDesire,
          initialChoice: finished.initialChoice,
          flipThreshold: finished.flipThreshold,
          neverFlipped: finished.neverFlipped,
          barrier: finished.barrier,
        }),
      })
    } catch {
      // Class project: a dropped write just means one missing row. Never block play.
    }
  }

  const restart = () => {
    setRun(emptyRun)
    setStep(0)
  }

  const choseRate = run.initialChoice === 'A'

  return (
    <main className="app">
      <div className="crt" aria-hidden="true" />

      {step === 0 && <Disclaimer onStart={next} />}

      {step === 1 && (
        <StoryCard
          art={<Castle size="just_right" px={120} />}
          kicker="Chapter I"
          title="Bound to your hearth"
          lines={[
            'In the Realm of Bostonia, every homeowner is bound to their keep by a powerful enchantment: a low, locked rate.',
            'Leave, and the spell breaks forever. Yet still the road calls... First, hero, who are you?',
          ]}
          plain="Mortgage rates are much higher now, so moving usually means trading your low rate for a worse one."
          cta="FORGE MY HERO"
          onNext={next}
        />
      )}

      {step === 2 && <AvatarBuilder run={run} patch={patch} onNext={next} />}

      {step === 3 && (
        <StoryCard
          art={<Scroll px={120} />}
          kicker="Chapter II"
          title="A herald arrives"
          lines={[
            'Word of your keep has spread across the realm. A herald rides to your gate bearing two offers, each meant to coax you toward a new home.',
            'Weigh them well, hero. Only one path can be yours.',
          ]}
          plain="You're about to choose between keeping your mortgage rate or taking a cash bonus to move."
          cta="HEAR THE OFFERS"
          onNext={next}
        />
      )}

      {step === 4 && (
        <Choice
          onChoose={(choice) => {
            patch({ initialChoice: choice })
            next()
          }}
        />
      )}

      {step === 5 && (
        <StoryCard
          art={<Chest px={120} glow />}
          kicker="Chapter III"
          title={choseRate ? 'The merchant returns' : 'The dragon stirs'}
          lines={
            choseRate
              ? [
                  'You chose to guard your enchantment and carry it onward. But a treasure-merchant will not take no for an answer.',
                  'With every refusal, the gold he offers climbs higher. How high before you let your rate go?',
                ]
              : [
                  'You reached for the gold. But the dragon guarding it stirs, and the treasure shrinks with every breath.',
                  'How little must remain before you turn back and keep your rate instead?',
                ]
          }
          plain={
            choseRate
              ? 'How big a cash bonus would it take for you to give up your current mortgage rate?'
              : "How small a cash bonus before you'd rather just keep your current rate?"
          }
          cta="FACE THE TRIAL"
          onNext={next}
        />
      )}

      {step === 6 && (
        <Escalator
          initialChoice={run.initialChoice}
          onDone={({ flipThreshold, neverFlipped }) => {
            patch({ flipThreshold, neverFlipped })
            next()
          }}
        />
      )}

      {step === 7 && (
        <StoryCard
          art={<Orb px={120} />}
          kicker="Chapter IV"
          title="The Oracle waits"
          lines={[
            'Your trial is done. At the road\'s end sits the Oracle, who sees past gold and glory.',
            '"Tell me true," she says. "Beyond every offer, what truly keeps you home?"',
          ]}
          plain="What's the real reason you haven't moved?"
          cta="SPEAK TO THE ORACLE"
          onNext={next}
        />
      )}

      {step === 8 && <Barrier onPick={(barrier) => submit({ barrier })} />}

      {step === 9 && <Result run={run} onRestart={restart} />}
    </main>
  )
}
