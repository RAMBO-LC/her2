import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'

export default function MouseTracker() {
  useEffect(() => {
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      useStore.getState().setMouse(e.clientX, e.clientY, x, y)
    }

    const handleTouch = (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0]
        const x = (t.clientX / window.innerWidth) * 2 - 1
        const y = -(t.clientY / window.innerHeight) * 2 + 1
        useStore.getState().setMouse(t.clientX, t.clientY, x, y)
      }
    }

    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', (e) => {
        const x = (e.gamma || 0) / 45
        const y = (e.beta || 0) / 45 - 0.5
        useStore.getState().setMouse(0, 0, x, y)
      })
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch)

    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
    }
  }, [])

  return null
}
