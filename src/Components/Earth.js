import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import * as THREE from 'three';
import Orbit from './Orbit';
import EarthOrbit from '../Constants/earthOrbit.json'
import { earthConstants } from '../Constants/ShapeCoordsContants';
export default function Earth({ earthRef, followPlanetRef, radiusRef, selectedPlanet }) {
  const time = useRef(Date.now());
  const [showOrbit, setShowOrbit] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(earthConstants.color);
  useFrame((state, delta) => {
    if (earthRef.current) {
      const orbitalPeriod = earthConstants.orbitalPeriod;

            earthRef.current.rotation.y += earthConstants.rotationSpeed;
            time.current += delta;

            earthRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * earthConstants.majorAxis +earthConstants.offsetX;
            earthRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * earthConstants.minorAxis + earthConstants.offsetZ;
            earthRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(earthConstants.tilt) * earthConstants.majorAxis + earthConstants.offsetY;

            const axialTilt = earthConstants.axialTilt;
            earthRef.current.rotation.x = axialTilt;
    }
  });
  const handlePointerOver = () => {
    setHovered(true);
    setColor(earthConstants.hoverColor);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    setColor(earthConstants.color);
    document.body.style.cursor = "auto";
  };

  const handleClick = () => {
    setShowOrbit(!showOrbit);
    radiusRef.current = earthConstants.radius;
    selectedPlanet.current = 3
    followPlanetRef.current = (followPlanetRef.current + 1) % 3;
  };

  return (
    <>
      <mesh onClick={handleClick} ref={earthRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        style={{ cursor: hovered ? "pointer" : "auto" }}
      >
        <ModelProcessor
          url={require("../Models/EarthClouds.glb")}
          scale={earthConstants.modelScale}
          position={[0, 0, 0]}
          ref={earthRef}
        />

      </mesh>
      {showOrbit &&
        <Orbit coordinates={EarthOrbit} color={color} hoverColor={"green"} thickness={10} />
      }
    </>
  );
}
