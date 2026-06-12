import { useState } from 'react'
import Disclaimer from './screens/Disclaimer.jsx'
import AvatarBuilder from './screens/AvatarBuilder.jsx'
import Choice from './screens/Choice.jsx'
import Escalator from './screens/Escalator.jsx'
import Barrier from './screens/Barrier.jsx'
import Result from './screens/Result.jsx'
import { QuestMap } from './components/Juice.jsx'

// The whole game is six screens advanced by a single step counter. All the data
// for one run lives in `run`; we POST it once, right after the barrier screen.
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

  // The quest map shows on the four interactive journey screens (1-4).
  const showMap = step >= 1 && step <= 4

  return (
    <main className="app">
      <div className="crt" aria-hidden="true" />
      {showMap && <QuestMap stage={step} />}
      {step === 0 && <Disclaimer onStart={next} />}
      {step === 1 && (
        <AvatarBuilder run={run} patch={patch} onNext={next} />
      )}
      {step === 2 && (
        <Choice
          onChoose={(choice) => {
            patch({ initialChoice: choice })
            next()
          }}
        />
      )}
      {step === 3 && (
        <Escalator
          initialChoice={run.initialChoice}
          onDone={({ flipThreshold, neverFlipped }) => {
            patch({ flipThreshold, neverFlipped })
            next()
          }}
        />
      )}
      {step === 4 && (
        <Barrier
          onPick={(barrier) => submit({ barrier })}
        />
      )}
      {step === 5 && <Result run={run} onRestart={restart} />}
    </main>
  )
}
