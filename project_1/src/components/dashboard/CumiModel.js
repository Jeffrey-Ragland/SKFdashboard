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
      //const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      //camera.position.set(0, 0, 150);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
  
      renderer.setSize(container.clientWidth, container.clientHeight);
      //renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff);
      //const containerDiv = document.getElementById('threeContainer');
      container.appendChild(renderer.domElement);
      //containerDiv.appendChild(renderer.domElement);
 
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
      const loader = new GLTFLoader();
      loader.load(
        //'/models/cumi.glb',
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

      // const handleResize = () => {
      //   camera.aspect = window.innerWidth / window.innerHeight;
      //   camera.updateProjectionMatrix();
      //   renderer.setSize(window.innerWidth, window.innerHeight);
      // };
  
      // window.addEventListener('resize', handleResize);

      return() =>
      {
        //cleanup
        container.removeChild(renderer.domElement);
        // window.removeEventListener('resize', handleResize);
        // containerDiv.removeChild(renderer.domElement);
      };
    },[]);
  
      return <div ref={containerRef} className='w-full h-full mx-auto'/>;
      // return <div id="threeContainer" className='w-full h-full mx-auto' />;
  };
  
  export default CumiModel;
  



  //https://www.creators3d.com/online-viewer