import * as THREE from 'three';
import React, {useEffect, useRef} from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CumiModel = () => {

    const containerRef = useRef();
    
    useEffect(()=>
    {
      const container = containerRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
  
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0xffffff);
      container.appendChild(renderer.domElement);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
      const loader = new GLTFLoader();
      loader.load(
        '/models/cumi.glb',
        (gltf) => {
          gltf.scene.scale.set(0.5, 0.5, 0.5)
          scene.add(gltf.scene);

          gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
          
        },
        undefined,
        (error) => {
          console.error('Error loading GLB model:', error);
        }
      );
  
      camera.position.z = 150;

      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(0, 100, 100);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

      const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;
        //controls.enableZoom = false;
  
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
  
      animate();

      return() =>
      {
        //cleanup
        container.removeChild(renderer.domElement);
      };
    },[]);
  
      return <div ref={containerRef} className='w-full h-full mx-auto'/>;
  };
  
  export default CumiModel;