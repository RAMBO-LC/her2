import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

export function Mountains({ colors, isNight }) {
  const ref = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const mouseX = useStore((s) => s.mouseNormalX)

  const shapes = useMemo(() => {
    const mountains = []
    for (let i = 0; i < 3; i++) {
      const w = 6 + Math.random() * 4
      const h = 1 + Math.random() * 0.8
      const segs = 64
      const positions = []
      for (let j = 0; j <= segs; j++) {
        const t = (j / segs) * 2 - 1
        const x = t * w
        const y = (1 - t * t) * h + (Math.sin(t * 8 + i * 2) * 0.1 + Math.sin(t * 15 + i * 5) * 0.05) * h
        positions.push(x, y, (Math.random() - 0.5) * 0.3)
      }
      mountains.push({ positions, z: -1.5 - i * 0.3 })
    }
    return mountains
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const scrollOffset = scrollProgress * 0.4
    const mouseOffset = mouseX * 0.03
    ref.current.position.y = -scrollOffset * 0.05
    ref.current.position.x = mouseOffset * 0.5
  })

  const mountainColor = isNight
    ? new THREE.Color('#0a0a1a')
    : new THREE.Color(colors.fog).multiplyScalar(0.7)

  return (
    <group ref={ref}>
      {shapes.map((m, i) => (
        <mesh key={i} position={[0, -0.5, m.z]}>
          <shapeGeometry>
            <shape>
              {(() => {
                const s = new THREE.Shape()
                s.moveTo(-6, -1)
                for (let j = 0; j < m.positions.length; j += 3) {
                  s.lineTo(m.positions[j] * 0.6, m.positions[j + 1] * 0.8)
                }
                s.lineTo(6, -1)
                s.lineTo(-6, -1)
                return s
              })()}
            </shape>
          </shapeGeometry>
          <meshBasicMaterial
            color={mountainColor}
            transparent
            opacity={0.4 + i * 0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
