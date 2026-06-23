import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

const treeShape = new THREE.Shape()
treeShape.moveTo(0, 0.8)
treeShape.quadraticCurveTo(-0.08, 0.6, -0.02, 0.4)
treeShape.quadraticCurveTo(-0.12, 0.3, -0.03, 0.15)
treeShape.quadraticCurveTo(-0.1, 0.05, 0, 0)
treeShape.quadraticCurveTo(0.1, 0.05, 0.03, 0.15)
treeShape.quadraticCurveTo(0.12, 0.3, 0.02, 0.4)
treeShape.quadraticCurveTo(0.08, 0.6, 0, 0.8)

export function Treeline({ isNight }) {
  const ref = useRef()
  const scrollProgress = useStore((s) => s.scrollProgress)
  const windGust = useStore((s) => s.windGust)
  const windTime = useStore((s) => s.windTime)
  const mouseX = useStore((s) => s.mouseNormalX)

  const trees = useMemo(() => {
    const arr = []
    for (let i = 0; i < 15; i++) {
      const x = (i / 14) * 12 - 6
      arr.push({
        x,
        scale: 0.4 + Math.random() * 0.4,
        basePhase: Math.random() * Math.PI * 2,
        color: new THREE.Color(
          0.15 + Math.random() * 0.1,
          0.25 + Math.random() * 0.15,
          0.1 + Math.random() * 0.05
        ),
      })
    }
    return arr
  }, [])

  const trunkMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#3d2b1f',
    transparent: true,
    opacity: 0.7,
  }), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const scrollOffset = scrollProgress * 0.8
    const mouseOffset = mouseX * 0.04
    ref.current.position.y = -scrollOffset * 0.12
    ref.current.position.x = mouseOffset * 0.5

    const gust = windGust > 0.1 ? windGust : 0
    ref.current.children.forEach((child, i) => {
      if (i >= trees.length) return
      const tree = trees[i]
      const baseSway = Math.sin(t * 0.3 + tree.basePhase) * 0.02
      const gustSway = gust * Math.sin(t * 2 + tree.basePhase) * 0.06
      const sway = baseSway + gustSway
      child.rotation.z = sway * (1 + tree.scale * 0.5)
    })
  })

  return (
    <group ref={ref} position={[0, -0.3, -0.3]}>
      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, -0.2, 0]}>
          <mesh position={[0, -0.1, 0]} scale={[0.02, 0.25, 0.02]} material={trunkMat}>
            <cylinderGeometry args={[1, 1, 1, 4]} />
          </mesh>
          <mesh scale={[tree.scale, tree.scale, tree.scale]} position={[0, 0.15, 0]}>
            <shapeGeometry args={[treeShape]} />
            <meshBasicMaterial
              color={tree.color}
              transparent
              opacity={isNight ? 0.4 : 0.7}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
