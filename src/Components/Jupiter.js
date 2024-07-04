import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import JupiterOrbit from '../Constants/jupiterOrbit.json';
import { jupiterConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateJupiterPosition() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const yearLength = 4332.59; 
  const meanAnomaly = (2 * Math.PI * dayOfYear) / yearLength;

  const eccentricity = 0.0489;

  let E = meanAnomaly;
  for (let i = 0; i < 5; i++) {
    E = meanAnomaly + eccentricity * Math.sin(E);
  }
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  );

  return {
    x: Math.cos(trueAnomaly) * jupiterConstants.majorAxis + jupiterConstants.offsetX,
    y: Math.sin(trueAnomaly) * Math.tan(jupiterConstants.tilt) * jupiterConstants.majorAxis + jupiterConstants.offsetY,
    z: Math.sin(trueAnomaly) * jupiterConstants.minorAxis + jupiterConstants.offsetZ,
  };
}

export default function Jupiter({ jupiterRef, followPlanetRef, radiusRef, selectedPlanet, setSelectedPlanetState, selectedPlanetState}) {
  let time = useRef(0);
  const jupiterTextRef = useRef(null);
  const [showOrbit, setShowOrbit] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState("yellow");
  const { camera } = useThree();

  useEffect(() => {
    const initialPosition = calculateJupiterPosition();
    if (jupiterRef.current) {
      jupiterRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    }
  }, []);

  useFrame((state, delta) => {
    if (jupiterRef.current) {
      const orbitalPeriod = jupiterConstants.orbitalPeriod;

      jupiterRef.current.rotation.y += jupiterConstants.rotationSpeed;
      time.current += delta;

      jupiterRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * jupiterConstants.majorAxis + jupiterConstants.offsetX;
      jupiterRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * jupiterConstants.minorAxis + jupiterConstants.offsetZ;
      jupiterRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(jupiterConstants.tilt) * jupiterConstants.majorAxis + jupiterConstants.offsetY;

      const axialTilt = jupiterConstants.axialTilt;
      jupiterRef.current.rotation.x = axialTilt;

      jupiterTextRef?.current?.lookAt(camera.position);
      const distance = jupiterRef.current.position.distanceTo(camera.position);
      if (showOrbit) {
        if (distance > 35) {
          let textScale = distance / 20;
          jupiterTextRef.current.scale.set(textScale, textScale, textScale);
          jupiterTextRef.current.position.y = 0.45 * textScale;
        } else {
          jupiterTextRef.current.position.y = 0.75;
          jupiterTextRef.current.scale.set(0.5, 0.5, 0.5);
        }
      }
    }
  });

  const handleClick = () => {
    const num = jupiterConstants.selectedPlanet;
    setShowOrbit(!showOrbit);
    selectedPlanet.current = jupiterConstants.selectedPlanet;
    setSelectedPlanetState((prev)=>{
      if (prev === num) {
        return 0;
      }
      return num;
    })
    // setSelectedPlanetState(showOrbit ? selectedPlanet.current : 0);
    radiusRef.current = jupiterConstants.radius;
    followPlanetRef.current =(selectedPlanetState===num)? (followPlanetRef.current + 1) % 3:1;
    // followPlanetRef.current = (followPlanetRef.current + 1) % 3;
  };

  const handlePointerOver = () => {
    setHovered(true);
    setColor("blue");
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    setColor("yellow");
    document.body.style.cursor = "auto";
  };

  return (
    <>
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        ref={jupiterRef}
        style={{ cursor: hovered ? "pointer" : "auto" }}
      >
        <ModelProcessor
          url={require("../Models/Jupiter.glb")}
          scale={jupiterConstants.modelScale}
          position={[0, 0, 0]}
          ref={jupiterRef}
        />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={hovered ? 10 : 1}
          attach="material"
        />
        {selectedPlanetState !== jupiterConstants.selectedPlanet &&
          <Text
            position={[0, 1, 0]}
            fontSize={0.5}
            color={hovered ? jupiterConstants.textHoverColor : jupiterConstants.textNormalColor}
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, 0]}
            ref={jupiterTextRef}
          >
            Jupiter
          </Text>
        }
      </mesh>
      {selectedPlanetState !== jupiterConstants.selectedPlanet &&
        <Orbit coordinates={JupiterOrbit} color={color} hoverColor={"blue"} thickness={10} />
      }
    </>
  );
}
