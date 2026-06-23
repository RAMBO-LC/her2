import { useEffect } from 'react'
import useStore from '../store/useStore'

export default function ParallaxScroll() {
  const setScroll = useStore((s) => s.setScrollProgress)
  const setScrollVelocity = useStore((s) => s.setScrollVelocity)

  useEffect(() => {
    let lastY = 0
    let velocity = 0

    const handleWheel = (e) => {
      e.preventDefault()
      const delta = e.deltaY * 0.01
      velocity = delta
      useStore.getState().setScrollVelocity(delta)
      useStore.getState().setScrollProgress(
        Math.max(0, Math.min(1, useStore.getState().scrollProgress + delta))
      )
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const delta = (touchStartY - e.touches[0].clientY) * 0.005
      touchStartY = e.touches[0].clientY
      useStore.getState().setScrollVelocity(delta)
      useStore.getState().setScrollProgress(
        Math.max(0, Math.min(1, useStore.getState().scrollProgress + delta))
      )
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return null
}
