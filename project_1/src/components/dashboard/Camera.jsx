/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 camera.gltf 
Author: Aleksei Rozumnyi (https://sketchfab.com/Aleksei.Rozumnyi)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/robotic-eye-7b7ecc70526a4261a705f64655c13aa5
Title: Robotic Eye
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/camera.gltf')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.056}>
        <group rotation={[-0.062, 0.001, -0.031]}>
          <group position={[0, -1.444, 0]} scale={0.711}>
            <mesh geometry={nodes.Camera005_0.geometry} material={materials.Camera_Plastic} />
            <mesh geometry={nodes.Camera005_1.geometry} material={materials.Camera_Lens} />
          </group>
          <mesh geometry={nodes.Eyeball_Segment_Low_Poly_0.geometry} material={materials.White_Plastic} />
          <mesh geometry={nodes.Eyeball_Segment_Low_Poly002_0.geometry} material={materials.White_Plastic} rotation={[Math.PI, -Math.PI / 3, Math.PI]} />
          <mesh geometry={nodes.Eyeball_Segment_Low_Poly001_0.geometry} material={materials.White_Plastic} rotation={[-Math.PI, Math.PI / 3, -Math.PI]} />
          <mesh geometry={nodes.Battery_0.geometry} material={materials.Copper} position={[0, -1.444, 0]} rotation={[Math.PI, -Math.PI / 3, Math.PI]} scale={0.711} />
          <mesh geometry={nodes.Battery002_0.geometry} material={materials.Copper} position={[0, -1.444, 0]} rotation={[-Math.PI, 1.047, -Math.PI]} scale={0.711} />
          <mesh geometry={nodes.Battery001_0.geometry} material={materials.Copper} position={[0, -1.444, 0]} scale={0.711} />
          <mesh geometry={nodes.Armature002_0.geometry} material={materials['Metal.001']} position={[0, 0.832, -0.001]} />
          <mesh geometry={nodes.Circle_Low_Poly_0.geometry} material={materials.Black_Plastic} />
          <mesh geometry={nodes.BezierCurve005_0.geometry} material={materials['BezierCurve.006_0']} position={[-0.378, -0.902, 0.818]} />
          <mesh geometry={nodes.Clip_0.geometry} material={materials.Metal} position={[0, 0.911, -0.697]} rotation={[-0.946, 0, 0]} scale={[0.145, 0.061, 0.061]} />
          <mesh geometry={nodes.Lens_Low_Poly_0.geometry} material={materials.Glass} />
          <mesh geometry={nodes.Light_Low_Poly_0.geometry} material={materials.Light} />
        </group>
        <mesh geometry={nodes.BezierCurve006_0.geometry} material={materials['BezierCurve.006_0']} position={[-0.378, -0.902, 0.818]} />
      </group>
    </group>
  )
}

useGLTF.preload('/camera.gltf')
