import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

const flowerGeom = new THREE.PlaneGeometry(0.04, 0.04)
flowerGeom.translate(0, 0.02, 0)

export function Wildflowers({ isNight }) {
  const ref = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const windGust = useStore((s) => s.windGust)
  const mouseNormalX = useStore((s) => s.mouseNormalX)
  const mouseNormalY = useStore((s) => s.mouseNormalY)
  const mouseX = useStore((s) => s.mouseX)
  const mouseY = useStore((s) => s.mouseY)
  const petals = useRef([])

  const flowers = useMemo(() => {
    const arr = []
    const count = 80
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8
      const z = (Math.random() - 0.5) * 2 - 0.5
      arr.push({
        x,
        z,
        size: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        color: new THREE.Color(
          0.9 + Math.random() * 0.1,
          0.85 + Math.random() * 0.15,
          0.7 + Math.random() * 0.3
        ),
        bendSpeed: 1 + Math.random(),
      })
    }
    return arr
  }, [])

  const instancedMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(flowerGeom, new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
    }), flowers.length)

    const dummy = new THREE.Object3D()
    flowers.forEach((f, i) => {
      dummy.position.set(f.x, 0.05 + Math.random() * 0.1, f.z)
      dummy.scale.set(f.size, f.size, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(flowers.flatMap(f => [f.color.r, f.color.g, f.color.b])),
      3
    )
    return mesh
  }, [flowers])

  useFrame(({ clock, camera }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const scrollOffset = scrollProgress * 1.5
    ref.current.position.y = -scrollOffset * 0.3
    ref.current.rotation.x = Math.sin(t * 0.5) * windGust * 0.05

    const dummy = new THREE.Object3D()
    flowers.forEach((f, i) => {
      const wind = Math.sin(t * 0.8 + f.phase) * 0.02 + windGust * Math.sin(t * 1.5 + f.phase) * 0.08 * f.bendSpeed

      const sx = (mouseX / window.innerWidth) * 8 - 4
      const sy = -(mouseY / window.innerHeight) * 6 + 3
      const dx = f.x - sx
      const dy = f.z * 3 - sy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const mouseBend = dist < 1.5 ? (1.5 - dist) * 0.15 : 0
      const mouseDir = dx > 0 ? 1 : -1

      const bend = wind + mouseBend * mouseDir
      dummy.position.set(f.x, 0.05 + Math.random() * 0.01, f.z)
      dummy.scale.set(f.size, f.size, 1)
      dummy.rotation.z = bend
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  const handleClick = useCallback((e) => {
    if (!e.point) return
    for (let i = 0; i < 5; i++) {
      const petal = document.createElement('div')
      petal.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: #fef0d5;
        border-radius: 50% 0;
        pointer-events: none;
        z-index: 20;
        left: ${e.clientX || window.innerWidth/2}px;
        top: ${e.clientY || window.innerHeight/2}px;
        animation: float-up ${2 + Math.random() * 2}s ease-out forwards;
        animation-delay: ${i * 0.1}s;
      `
      document.body.appendChild(petal)
      setTimeout(() => petal.remove(), 5000)
    }
  }, [])

  return (
    <primitive
      ref={ref}
      object={instancedMesh}
      position={[0, -0.1, 0.3]}
      onClick={handleClick}
    />
  )
}
