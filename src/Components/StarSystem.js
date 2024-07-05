import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { starsConstants } from '../Constants/ShapeCoordsContants';

export default function StarSystem() {
  const groupRef = useRef();

  useEffect(() => {
    const blueStarsGeometry = new THREE.BufferGeometry();
    const goldenStarsGeometry = new THREE.BufferGeometry();
    
    const blueStarVertices = [];
    const goldenStarVertices = [];
    
    for (let i = 0; i < starsConstants.starCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = starsConstants.distance;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      if (Math.random() < 0.5) {
        blueStarVertices.push(x, y, z);
      } else {
        goldenStarVertices.push(x, y, z);
      }
    }

    blueStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(blueStarVertices, 3));
    goldenStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(goldenStarVertices, 3));

    const blueStarsMaterial = new THREE.PointsMaterial({ 
      color: 0x0000ff, 
      emissive: 0x0000ff, 
      emissiveIntensity: 1.5, 
      size: 1.0 
    });

    const goldenStarsMaterial = new THREE.PointsMaterial({ 
      color: 0xffd700, 
      emissive: 0xffd700, 
      emissiveIntensity: 0.5, 
      size: 0.30
    });

    const blueStars = new THREE.Points(blueStarsGeometry, blueStarsMaterial);
    const goldenStars = new THREE.Points(goldenStarsGeometry, goldenStarsMaterial);
    
    groupRef.current.add(blueStars);
    groupRef.current.add(goldenStars);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += starsConstants.rotationSpeed;
    }
  });

  return <group ref={groupRef} />;
}
