import React, { Suspense } from 'react'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import Camera from './Camera'

const CameraModel = () => {
  return (
    <>
      <Canvas>
      <ambientLight intensity={2}/>
        <OrbitControls enableZoom={false}/>
        <Suspense fallback={null}>
           <Camera scale={[40, 40, 40]}/> 
        </Suspense>
      </Canvas>
    </>
  )
}

export default CameraModel
