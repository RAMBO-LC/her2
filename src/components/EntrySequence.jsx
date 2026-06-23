import { useEffect, useState } from 'react'
import useStore from '../store/useStore'

export default function EntrySequence({ onComplete }) {
  useEffect(() => {
    const t1 = setTimeout(() => {
      onComplete()
    }, 3600)
    return () => clearTimeout(t1)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <p className="entry-text">i made you something</p>
    </div>
  )
}
