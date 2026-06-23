import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { getGrassCount } from '../utils/helpers'

export function TallGrass({ isNight }) {
  const ref = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const windGust = useStore((s) => s.windGust)
  const windTime = useStore((s) => s.windTime)
  const mouseX = useStore((s) => s.mouseNormalX)
  const scrollVelocity = useStore((s) => s.scrollVelocity)

  const count = getGrassCount()

  const { positions, heights, phases } = useMemo(() => {
    const pos = []
    const h = []
    const ph = []
    const cols = Math.ceil(Math.sqrt(count))
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = (col / cols) * 10 - 5 + (Math.random() - 0.5) * 0.1
      const z = (row / cols) * 3 - 1 + (Math.random() - 0.5) * 0.1
      const height = 0.3 + Math.random() * 0.7
      pos.push(x, height / 2, z)
      h.push(height)
      ph.push(Math.random() * Math.PI * 2)
    }
    return { positions: new Float32Array(pos), heights: h, phases: ph }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const indices = []
    const uvs = []
    for (let i = 0; i < count; i++) {
      const idx = i * 4
      indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3)
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1)
    }
    geo.setIndex(indices)
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    const pos = geo.attributes.position.array
    const verts = []
    for (let i = 0; i < count; i++) {
      const h = heights[i]
      const baseX = positions[i * 3]
      const baseZ = positions[i * 3 + 2]
      verts.push(baseX, 0, baseZ)
      verts.push(baseX + 0.02, 0, baseZ)
      verts.push(baseX + 0.02, h, baseZ)
      verts.push(baseX, h, baseZ)
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geo.computeVertexNormals()

    return geo
  }, [positions, heights, count])

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uWindStrength: { value: 0.3 },
      uGust: { value: 0 },
      uColor: { value: new THREE.Color(isNight ? '#0a1a0a' : '#4a7a3a') },
      uNight: { value: isNight ? 1 : 0 },
      uHeightScale: { value: 1 },
    },
    vertexShader: document.getElementById('grassVert')?.textContent || `
      uniform float uTime;
      uniform float uWindStrength;
      uniform float uGust;
      uniform vec3 uColor;
      uniform float uHeightScale;
      varying vec2 vUv;
      varying float vHeight;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float height = pos.y;
        vHeight = height;
        float windPhase = pos.x * 3.0 + uTime * 1.5 + pos.z * 2.0;
        float windDisp = sin(windPhase) * uWindStrength * height * 0.3;
        windDisp += sin(pos.x * 1.5 + uTime * 0.6 + uGust) * uGust * 0.5 * height * 0.4;
        pos.x += windDisp;
        pos.z += cos(windPhase * 0.7) * uWindStrength * height * 0.15;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: document.getElementById('grassFrag')?.textContent || `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uNight;
      varying vec2 vUv;
      varying float vHeight;
      void main() {
        float alpha = smoothstep(0.0, 0.3, vHeight);
        vec3 color = uColor;
        if (uNight > 0.5) {
          color = mix(uColor, vec3(0.05, 0.05, 0.15), 0.6);
        }
        float tip = smoothstep(0.7, 1.0, vHeight);
        color += tip * vec3(0.05, 0.03, 0.0);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), [isNight])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const scrollOffset = scrollProgress * 2
    ref.current.position.y = -scrollOffset * 0.5
    ref.current.position.x = mouseX * 0.06

    const u = ref.current.material.uniforms
    u.uTime.value = t
    u.uGust.value = windGust > 0.1 ? windGust : 0
    u.uWindStrength.value = 0.3 + Math.abs(scrollVelocity) * 2
  })

  return (
    <mesh ref={ref} geometry={geometry} material={material} position={[0, -0.4, 0.8]} />
  )
}
