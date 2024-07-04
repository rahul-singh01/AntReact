import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { starsConstants } from '../Constants/ShapeCoordsContants';

export default function StarSystem() {
  const groupRef = useRef();

  useEffect(() => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0x888888, emissive: 0x888888, decay: 0, emissiveIntensity: 1, size: 0.30});

    const starVertices = [];
    for (let i = 0; i < starsConstants.starCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = starsConstants.distance;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      starVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    groupRef.current.add(stars);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += starsConstants.rotationSpeed;
    }
  });

  return <group ref={groupRef} />;
}
