import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

export function Stream({ skyColor, isNight }) {
  const ref = useRef()
  const bridgeRef = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const mouseX = useStore((s) => s.mouseNormalX)
  const mouseNormalX = useStore((s) => s.mouseNormalX)
  const mouseNormalY = useStore((s) => s.mouseNormalY)
  const windGust = useStore((s) => s.windGust)
  const ripples = useRef([])
  const clockRef = useRef(0)

  const waterColor = useMemo(() => {
    const c = new THREE.Color(skyColor)
    c.lerp(new THREE.Color('#5a7a8a'), 0.6)
    return c
  }, [skyColor])

  useFrame(({ clock }) => {
    if (!ref.current) return
    clockRef.current = clock.getElapsedTime()
    const scrollOffset = scrollProgress * 1.2
    const mouseOff = mouseX * 0.05
    ref.current.position.y = -scrollOffset * 0.2
    ref.current.position.x = mouseOff * 0.3
    if (bridgeRef.current) {
      bridgeRef.current.position.y = -scrollOffset * 0.2
      bridgeRef.current.position.x = mouseOff * 0.3
    }

    const u = ref.current.material.uniforms
    if (u) {
      u.uTime.value = clock.getElapsedTime()
      u.uMouse.value.set(mouseNormalX * 3, mouseNormalY * 2)
      u.uIntensity.value = 1 + windGust * 3
    }
  })

  const handleClick = useCallback((e) => {
    if (!e.point) return
    ripples.current.push({
      x: e.point.x * 0.3,
      y: e.point.z * 0.3,
      time: clockRef.current,
    })
    if (ripples.current.length > 10) ripples.current.shift()
  }, [])

  return (
    <group>
      <group ref={ref}>
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
          <planeGeometry args={[4, 1.2, 32, 32]} />
          <shaderMaterial
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            uniforms={{
              uTime: { value: 0 },
              uMouse: { value: new THREE.Vector2(0, 0) },
              uIntensity: { value: 1 },
              uSkyColor: { value: new THREE.Color(skyColor) },
              uWaterColor: { value: waterColor },
            }}
            vertexShader={document.getElementById('waterVert')?.textContent || `
              varying vec2 vUv;
              varying vec3 vPosition;
              void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={document.getElementById('waterFrag')?.textContent || `
              uniform float uTime;
              uniform vec2 uMouse;
              uniform float uIntensity;
              uniform vec3 uSkyColor;
              uniform vec3 uWaterColor;
              varying vec2 vUv;
              varying vec3 vPosition;

              float wave(vec2 p, float t) {
                float d1 = sin(p.x * 8.0 + t * 1.2) * 0.02;
                float d2 = sin(p.y * 12.0 + t * 0.8 + p.x * 3.0) * 0.015;
                float d3 = sin((p.x + p.y) * 6.0 + t * 0.5) * 0.01;
                return d1 + d2 + d3;
              }

              float ripple(vec2 p, vec2 center, float t) {
                float d = distance(p, center);
                float r = sin(d * 30.0 - t * 4.0) * exp(-d * 3.0) * 0.5;
                return r;
              }

              void main() {
                vec2 uv = vUv;
                float w = wave(uv, uTime);
                w += ripple(uv, uMouse, uTime) * uIntensity;
                vec3 base = mix(uWaterColor, vec3(1.0), 0.1);
                vec3 highlight = uSkyColor * 0.6;
                vec3 color = mix(base, highlight, w * 0.5 + 0.3);
                float spec = pow(max(0.0, w + 0.3), 4.0) * 0.3;
                color += vec3(spec * 0.8, spec * 0.9, spec);
                gl_FragColor = vec4(color, 0.7);
              }
            `}
          />
        </mesh>
      </group>

      <group ref={bridgeRef} position={[0, 0.08, -0.1]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.3]} />
          <meshBasicMaterial color="#5c4033" transparent opacity={0.6} depthWrite={false} />
        </mesh>
        <mesh position={[-0.5, -0.04, 0.1]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.04, 0.1, 0.04]} />
          <meshBasicMaterial color="#4a3228" />
        </mesh>
        <mesh position={[0.5, -0.04, 0.1]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.04, 0.1, 0.04]} />
          <meshBasicMaterial color="#4a3228" />
        </mesh>
        <mesh position={[-0.5, -0.04, -0.1]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.04, 0.1, 0.04]} />
          <meshBasicMaterial color="#4a3228" />
        </mesh>
        <mesh position={[0.5, -0.04, -0.1]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.04, 0.1, 0.04]} />
          <meshBasicMaterial color="#4a3228" />
        </mesh>
      </group>
    </group>
  )
}
