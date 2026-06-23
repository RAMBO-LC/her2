import { useEffect, useState } from 'react'
import Experience from './components/Experience'
import EntrySequence from './components/EntrySequence'
import FireflyPaper from './components/FireflyPaper'
import SoundGate from './components/SoundGate'
import JarIcon from './components/JarIcon'
import TonightsJar from './components/TonightsJar'
import useStore from './store/useStore'

export default function App() {
  const entryComplete = useStore((s) => s.entryComplete)
  const showPaper = useStore((s) => s.showPaper)
  const jarVisible = useStore((s) => s.jarVisible)
  const [showEntry, setShowEntry] = useState(true)

  return (
    <>
      {showEntry && <EntrySequence onComplete={() => setShowEntry(false)} />}
      <div style={{ position: 'fixed', inset: 0, opacity: entryComplete ? 1 : 0, transition: 'opacity 1s ease' }}>
        <Experience />
      </div>
      {showPaper && <FireflyPaper />}
      {entryComplete && <SoundGate />}
      {entryComplete && <JarIcon />}
      {jarVisible && <TonightsJar />}
    </>
  )
}
