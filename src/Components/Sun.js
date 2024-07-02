import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ModelProcessor from '../Utils/ModelProccessor';


export default function Sun() {
  const sunRef = useRef();
  const lightRef = useRef();
  const { scene } = useThree();

  // Create a white point light
  const lightColor = 'white';
  const lightIntensity = 1;
  const light = new THREE.PointLight(lightColor, lightIntensity);
  // Add the light to the scene
  scene.add(light);

  // useFrame(() => {
  //   if (sunRef.current) {
  //     sunRef.current.rotation.y += 0.005; // Add slight rotation to the sun for a dynamic effect
  //   }
  // });

  // useHelper(lightRef, PointLightHelper, 1, lightColor);

  function PointLightComponent({ position, color, intensity, distance, decay }) {
    return (
      <pointLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={intensity}
        distance={distance}
        decay={decay}
      />
    );
  }

  return (
    <>
      {/* <pointLight position={[0, 0, 0]} intensity={1.5} color="yellow" /> */}
      <mesh>
        <PointLightComponent
          position={[0, 0, 0]}
          color={'white'}
          intensity={2}
          distance={Infinity}
          decay={0}
        />
        <ModelProcessor
          url={require("../Models/Sun.glb")}
          scale={[0.2, 0.2, 0.2]}
          position={[0, 0, 0]}
          ref={sunRef}
        />
        {/* <meshStandardMaterial emissive={'yellow'} emissiveIntensity={100} /> */}
        {/* <primitive object={light} /> */}
      </mesh>
    </>
  );
}
