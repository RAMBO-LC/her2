import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

export function Fox({ isNight }) {
  const ref = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const mouseX = useStore((s) => s.mouseX)
  const mouseY = useStore((s) => s.mouseY)
  const foxState = useStore((s) => s.foxState)
  const setFoxState = useStore((s) => s.setFoxState)

  const stateRef = useRef({
    bodyBreathe: 0,
    earTarget: 0,
    earCurrent: 0,
    headTilt: 0,
    headTiltTarget: 0,
    tailWag: 0,
    walkTimer: 0,
    walkX: 0,
    alertTimer: 0,
    glanceTimer: 0,
    stretchProgress: 0,
    isStretching: false,
    clicked: false,
  })

  useEffect(() => {
    const alertInt = setInterval(() => {
      if (Math.random() > 0.5) {
        setFoxState('alert')
        setTimeout(() => setFoxState('idle'), 3000)
      }
    }, 30000 + Math.random() * 30000)
    const glanceInt = setInterval(() => {
      setFoxState('glance')
      setTimeout(() => setFoxState('idle'), 2000)
    }, 45000 + Math.random() * 45000)
    return () => {
      clearInterval(alertInt)
      clearInterval(glanceInt)
    }
  }, [setFoxState])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const s = stateRef.current

    const scrollOffset = scrollProgress * 2
    ref.current.position.y = -scrollOffset * 0.85 + 0.4

    s.bodyBreathe = Math.sin(t * 1.5) * 0.008

    if (foxState === 'alert') {
      s.earTarget = 0.15
      s.headTiltTarget = Math.sin(t * 2) * 0.03
    } else if (foxState === 'glance') {
      s.earTarget = 0.05
      s.headTiltTarget = 0.12
    } else {
      s.earTarget = 0
      s.headTiltTarget = 0
    }
    s.earCurrent += (s.earTarget - s.earCurrent) * 0.05
    s.headTilt += (s.headTiltTarget - s.headTilt) * 0.05

    if (ref.current.children.length > 0) {
      const body = ref.current.children[0]
      if (body) {
        body.position.y = s.bodyBreathe
        body.rotation.z = s.headTilt * 0.3
      }
    }

    if (s.clicked) {
      s.walkTimer += 0.02
      s.walkX = Math.sin(s.walkTimer * Math.PI) * 0.4
      if (s.walkTimer > 1) {
        s.clicked = false
        s.walkTimer = 0
        s.walkX = 0
      }
    }

    ref.current.position.x = s.walkX
    s.tailWag += (0.01 - s.tailWag) * 0.05
    if (Math.random() < 0.001) s.tailWag = 0.03
  })

  const headGroupRef = useRef()

  const handleClick = useCallback(() => {
    const s = stateRef.current
    if (!s.clicked) {
      s.clicked = true
      s.walkTimer = 0
    }
  }, [])

  const handleHover = useCallback(() => {
    stateRef.current.tailWag = 0.05
  }, [])

  const foxColor = isNight ? '#6a4a3a' : '#c07040'

  return (
    <group
      ref={ref}
      position={[2.2, 0.4, 1.2]}
      scale={[0.6, 0.6, 0.6]}
      onClick={handleClick}
      onPointerOver={handleHover}
    >
      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color={foxColor} />
      </mesh>

      {/* Head */}
      <group ref={headGroupRef} position={[0.15, 0.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshBasicMaterial color={foxColor} />
        </mesh>
        {/* Snout */}
        <mesh position={[0.1, -0.02, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#e8c8a8" />
        </mesh>
        {/* Nose */}
        <mesh position={[0.12, -0.01, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        {/* Eyes */}
        <mesh position={[0.06, 0.02, 0.04]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.06, 0.02, -0.04]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.02, 0.14, 0.04]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.04, 0.08, 6]} />
          <meshBasicMaterial color={foxColor} />
        </mesh>
        <mesh position={[-0.02, 0.14, -0.04]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.04, 0.08, 6]} />
          <meshBasicMaterial color={foxColor} />
        </mesh>
      </group>

      {/* Tail */}
      <mesh position={[-0.18, 0.05, 0]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.06, 0.2, 6]} />
        <meshBasicMaterial color={foxColor} />
      </mesh>

      {/* Legs */}
      {[[-0.08, -0.05, 0.06], [0.08, -0.05, 0.06], [-0.08, -0.05, -0.06], [0.08, -0.05, -0.06]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshBasicMaterial color="#3a2a1a" />
        </mesh>
      ))}
    </group>
  )
}
