import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { allContent, contentData } from '../data/content'
import { getFireflyCount, randomRange } from '../utils/helpers'

function createBezierPath(seed) {
  const r = () => (Math.random() - 0.5) * 4
  return [
    new THREE.Vector3(r(), r(), r()),
    new THREE.Vector3(r(), r(), r()),
    new THREE.Vector3(r(), r(), r()),
    new THREE.Vector3(r(), r(), r()),
  ]
}

function bezierPoint(t, points) {
  const u = 1 - t
  return new THREE.Vector3()
    .copy(points[0]).multiplyScalar(u * u * u)
    .add(points[1].clone().multiplyScalar(3 * u * u * t))
    .add(points[2].clone().multiplyScalar(3 * u * t * t))
    .add(points[3].clone().multiplyScalar(t * t * t))
}

export function Fireflies({ isNight }) {
  const groupRef = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const windGust = useStore((s) => s.windGust)
  const mouseNormalX = useStore((s) => s.mouseNormalX)
  const mouseNormalY = useStore((s) => s.mouseNormalY)
  const mouseX = useStore((s) => s.mouseX)
  const mouseY = useStore((s) => s.mouseY)
  const activeFirefly = useStore((s) => s.activeFirefly)
  const minigameActive = useStore((s) => s.minigameActive)
  const closePaper = useStore((s) => s.closePaper)
  const openPaper = useStore((s) => s.openPaper)

  const count = getFireflyCount()
  const fireflyData = useMemo(() => {
    const items = allContent.slice(0, count)
    while (items.length < count) {
      items.push(contentData.notes[0])
    }
    return items
  }, [count])

  const fireflies = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      content: fireflyData[i % fireflyData.length],
      path: createBezierPath(i),
      speed: randomRange(0.3, 0.8),
      phase: Math.random() * Math.PI * 2,
      brightFreq: randomRange(0.3, 0.8),
      color: new THREE.Color(fireflyData[i % fireflyData.length].firefly_color),
      pathOffset: Math.random(),
      isFast: fireflyData[i % fireflyData.length].speed === 'fast',
    }))
  }, [count, fireflyData])

  const glowMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#F2C94C') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: document.getElementById('fireflyFrag')?.textContent || `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float dist = distance(vUv, vec2(0.5));
        float glow = exp(-dist * dist * 30.0);
        float core = exp(-dist * dist * 200.0);
        vec3 color = uColor * (glow * 0.6 + core);
        float alpha = glow * 0.8 + core * 0.4;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  const stateRef = useRef({
    times: fireflies.map(() => Math.random() * 100),
    pathProgress: fireflies.map(() => Math.random()),
  })

  useFrame(({ clock, camera }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    const scrollOffset = scrollProgress * 1.5
    groupRef.current.position.y = -scrollOffset * 0.7

    const ff = groupRef.current.children

    ff.forEach((mesh, i) => {
      if (i >= fireflies.length || !mesh) return
      const f = fireflies[i]
      const state = stateRef.current

      if (minigameActive) {
        state.pathProgress[i] += 0.005 * (f.isFast ? 2 : 1)
      } else {
        state.pathProgress[i] += 0.002 * f.speed
      }
      if (state.pathProgress[i] > 1) {
        state.pathProgress[i] = 0
        f.path = createBezierPath(i)
      }

      const pos = bezierPoint(state.pathProgress[i], f.path)
      const driftX = Math.sin(t * 0.1 + f.phase) * 0.3
      const driftY = Math.cos(t * 0.12 + f.phase * 1.3) * 0.2
      const gustDrift = windGust > 0.1 ? windGust * Math.sin(t * 2 + f.phase) * 0.5 : 0
      pos.x += driftX + gustDrift
      pos.y += driftY
      pos.z += Math.sin(t * 0.08 + f.phase * 0.7) * 0.2
      mesh.position.copy(pos)

      const brightness = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * f.brightFreq + f.phase))
      const isHovered = activeFirefly === f.content.id
      const hoverBright = isHovered ? 1 : 0
      const finalAlpha = minigameActive ? 0.3 : (brightness * 0.7 + hoverBright * 0.3)
      mesh.material.uniforms.uColor.value.copy(f.color)
      mesh.material.uniforms.uTime.value = t
      mesh.material.opacity = finalAlpha
      const scale = isHovered ? 0.12 : 0.08
      mesh.scale.setScalar(scale)
    })
  })

  const handleClick = useCallback((e, index) => {
    if (minigameActive) return
    const f = fireflies[index]
    if (f) {
      openPaper(f.content)
    }
  }, [fireflies, minigameActive, openPaper])

  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {fireflies.map((f, i) => (
        <mesh
          key={i}
          material={glowMaterial.clone()}
          onClick={(e) => handleClick(e, i)}
          onPointerOver={() => {
            if (!minigameActive) document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default'
          }}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  )
}
