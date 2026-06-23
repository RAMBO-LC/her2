import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

export default function WindSystem() {
  const setWind = useStore((s) => s.setWind)
  const lastGustRef = useRef(0)
  const gustTimerRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    let running = true
    let nextGust = 15000 + Math.random() * 25000

    const tick = () => {
      if (!running) return
      timeRef.current += 0.016

      if (timeRef.current - lastGustRef.current > nextGust / 1000) {
        lastGustRef.current = timeRef.current
        nextGust = 15000 + Math.random() * 25000
        gustTimerRef.current = 1

        const gust = 0.5 + Math.random() * 0.5
        setWind(gust, timeRef.current)

        const fadeOut = () => {
          if (!running) return
          if (gustTimerRef.current > 0) {
            gustTimerRef.current -= 0.016
            const eased = gustTimerRef.current * gustTimerRef.current * (3 - 2 * gustTimerRef.current)
            setWind(gust * eased, timeRef.current)
            if (gustTimerRef.current > 0) {
              requestAnimationFrame(fadeOut)
            } else {
              setWind(0, timeRef.current)
            }
          }
        }
        setTimeout(() => requestAnimationFrame(fadeOut), 500)
      }

      requestAnimationFrame(tick)
    }

    const id = requestAnimationFrame(tick)
    return () => { running = false; cancelAnimationFrame(id) }
  }, [])

  return null
}
