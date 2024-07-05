import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import * as THREE from 'three';
import Orbit from './Orbit';
import EarthOrbit from '../Constants/earthOrbit.json';
import { earthConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateEarthPosition() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const yearLength = 365.25;
  const meanAnomaly = (2 * Math.PI * dayOfYear) / yearLength;

  const eccentricity = 0.0167;

  let E = meanAnomaly;
  for (let i = 0; i < 5; i++) {
    E = meanAnomaly + eccentricity * Math.sin(E);
  }
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  );

  return {
    x: Math.cos(trueAnomaly) * earthConstants.majorAxis + earthConstants.offsetX,
    y: Math.sin(trueAnomaly) * Math.tan(earthConstants.tilt) * earthConstants.majorAxis + earthConstants.offsetY,
    z: Math.sin(trueAnomaly) * earthConstants.minorAxis + earthConstants.offsetZ,
  };
}

export default function Earth({ earthRef, followPlanetRef, radiusRef, selectedPlanet, setSelectedPlanetState, selectedPlanetState }) {
  const time = useRef(Date.now());
  const earthTextRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(earthConstants.color);
  const { camera } = useThree();
  const moonRef = useRef(null);

  useEffect(() => {
    const initialPosition = calculateEarthPosition();
    if (earthRef.current) {
      earthRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    }
  }, []);

  useFrame((state, delta) => {
    if (earthRef.current) {
      const orbitalPeriod = earthConstants.orbitalPeriod;

      earthRef.current.rotation.y += earthConstants.rotationSpeed;
      time.current += delta;

      const earthX = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * earthConstants.majorAxis + earthConstants.offsetX;
      const earthZ = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * earthConstants.minorAxis + earthConstants.offsetZ;
      const earthY = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(earthConstants.tilt) * earthConstants.majorAxis + earthConstants.offsetY;

      earthRef.current.position.set(earthX, earthY, earthZ);

      if (moonRef.current) {
        moonRef.current.rotation.y += earthConstants.moon.rotationSpeed;
        const moonX = earthX + earthConstants.moon.distance * Math.cos((2 * Math.PI * time.current) / earthConstants.moon.orbitalPeriod);
        const moonZ = earthZ + earthConstants.moon.distance * Math.sin((2 * Math.PI * time.current) / earthConstants.moon.orbitalPeriod);
        const moonY = earthY;

        moonRef.current.position.set(moonX, moonY, moonZ);
      }

      const axialTilt = earthConstants.axialTilt;
      earthRef.current.rotation.x = axialTilt;

      earthTextRef?.current?.lookAt(camera.position);
      const distance = earthRef.current.position.distanceTo(camera.position);
      if (selectedPlanetState !== earthConstants.selectedPlanet) {
        if (distance > 35) {
          let textScale = distance / 20;
          earthTextRef.current.scale.set(textScale, textScale, textScale);
          earthTextRef.current.position.y = 0.45 * textScale;
        } else {
          earthTextRef.current.position.y = 0.75;
          earthTextRef.current.scale.set(0.5, 0.5, 0.5);
        }
      }
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

  const handleClick = (num) => {
    selectedPlanet.current = earthConstants.selectedPlanet;
    setSelectedPlanetState((prev) => {
      if (prev === num) {
        return 0;
      }
      return num;
    });
    radiusRef.current = earthConstants.radius;
    followPlanetRef.current = (selectedPlanetState === num) ? (followPlanetRef.current + 1) % 3 : 1;
  };

  return (
    <>
      <mesh onClick={() => { handleClick(earthConstants.selectedPlanet) }} ref={earthRef}
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
        {selectedPlanetState !== earthConstants.selectedPlanet &&
          <Text
            position={[0, 1, 0]}
            fontSize={0.5}
            color={hovered ? earthConstants.textHoverColor : earthConstants.textNormalColor}
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, 0]}
            ref={earthTextRef}
          >
            Earth
          </Text>
        }
      </mesh>
        <ModelProcessor 
          url={require("../Models/EarthMoon.glb")}
          scale={earthConstants.moon.modelScale}
          position={[0.1, 0, 0]}
          ref={moonRef}
        />
      {selectedPlanetState !== earthConstants.selectedPlanet &&
        <Orbit coordinates={EarthOrbit} color={color} hoverColor={"green"} thickness={10} />
      }
    </>
  );
}
