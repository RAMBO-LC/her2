import { Canvas } from '@react-three/fiber'
import { SkyBox } from './Sky'
import { Mountains } from './Mountains'
import { Treeline } from './Treeline'
import { Stream } from './Stream'
import { Wildflowers } from './Wildflowers'
import { TallGrass } from './TallGrass'
import { Fireflies } from './Fireflies'
import { Fox } from './Fox'
import { PostEffects } from './PostEffects'
import { ParallaxScroll } from './ParallaxScroll'
import { WindSystem } from './WindSystem'
import { MouseTracker } from './MouseTracker'
import useStore from '../store/useStore'
import { getTimeOfDay, getSkyColors } from '../data/content'
import { detectPerformance } from '../utils/helpers'
import { useEffect, useRef } from 'react'

export default function Experience() {
  const setPerformance = useStore((s) => s.setPerformance)

  useEffect(() => {
    setPerformance(detectPerformance())
  }, [])

  const timeOfDay = getTimeOfDay()
  const colors = getSkyColors(timeOfDay)
  const isNight = timeOfDay === 'night' || timeOfDay === 'dawn'

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: false,
        }}
        camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <SkyBox skyColors={colors} isNight={isNight} />
        <Mountains colors={colors} isNight={isNight} />
        <Treeline isNight={isNight} />
        <Stream skyColor={colors.mid} isNight={isNight} />
        <Wildflowers isNight={isNight} />
        <TallGrass isNight={isNight} />
        <Fireflies isNight={isNight} />
        <Fox isNight={isNight} />
        <PostEffects />
        <ParallaxScroll />
        <WindSystem />
        <MouseTracker />
      </Canvas>
    </div>
  )
}
