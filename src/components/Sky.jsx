import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

export function SkyBox({ skyColors, isNight }) {
  const ref = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const mouseX = useStore((s) => s.mouseNormalX)
  const starRef = useRef()

  const starPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 8 + Math.random() * 4
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        Math.abs(r * Math.cos(phi)),
        r * Math.sin(phi) * Math.sin(theta)
      )
    }
    return new Float32Array(pos)
  }, [])

  const starPhases = useMemo(() =>
    Array.from({ length: 200 }, () => ({
      freq: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      brightness: 0.3 + Math.random() * 0.7
    }))
  , [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const scrollOffset = scrollProgress * 0.3
    const mouseOffset = mouseX * 0.02
    ref.current.position.y = -scrollOffset * 0.02
    ref.current.position.x = mouseOffset

    if (starRef.current) {
      const stars = starRef.current
      const time = clock.getElapsedTime()
      for (let i = 0; i < 200; i++) {
        const s = starPhases[i]
        const bright = s.brightness * (0.5 + 0.5 * Math.sin(time * s.freq + s.phase))
        stars.geometry.attributes.size.array[i] = bright * 0.03
      }
      stars.geometry.attributes.size.needsUpdate = true
    }
  })

  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[30, 20]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          uniforms={{
            uTime: { value: 0 },
            uTopColor: { value: new THREE.Color(skyColors.top) },
            uMidColor: { value: new THREE.Color(skyColors.mid) },
            uBotColor: { value: new THREE.Color(skyColors.bot) },
            uNight: { value: isNight ? 1 : 0 },
          }}
          vertexShader={document.getElementById('skyVert')?.textContent || `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={document.getElementById('skyFrag')?.textContent || `
            uniform vec3 uTopColor;
            uniform vec3 uMidColor;
            uniform vec3 uBotColor;
            uniform float uNight;
            varying vec2 vUv;
            void main() {
              float gradient = vUv.y;
              vec3 color;
              if (gradient < 0.5) {
                float t = gradient / 0.5;
                color = mix(uBotColor, uMidColor, t);
              } else {
                float t = (gradient - 0.5) / 0.5;
                color = mix(uMidColor, uTopColor, t);
              }
              if (uNight > 0.5) {
                float horizonGlow = smoothstep(0.8, 0.4, gradient) * 0.15;
                color += horizonGlow * vec3(0.4, 0.3, 0.2);
              }
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>

      {isNight && (
        <points ref={starRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={200}
              array={starPositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={200}
              array={new Float32Array(200).fill(0.02)}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color="#ffffff"
            transparent
            opacity={0.8}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
      )}
    </group>
  )
}
