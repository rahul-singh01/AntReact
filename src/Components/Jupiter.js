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
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(jupiterConstants.color);
  const { camera } = useThree();
  const IoRef = useRef(null);
  const EuropaRef = useRef(null);
  const GanymedeRef = useRef(null);
  const CallistoRef = useRef(null);
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

      if (IoRef.current) {
        IoRef.current.position.x = jupiterRef.current.position.x + jupiterConstants.io.distance * Math.cos((2 * Math.PI * time.current) / jupiterConstants.io.orbitalPeriod);
        IoRef.current.position.z = jupiterRef.current.position.z + jupiterConstants.io.distance * Math.sin((2 * Math.PI * time.current) / jupiterConstants.io.orbitalPeriod);
        IoRef.current.position.y = jupiterRef.current.position.y + jupiterConstants.io.distance * Math.cos((2 * Math.PI * time.current) / jupiterConstants.io.orbitalPeriod) 
      }

      if (EuropaRef.current) {
        EuropaRef.current.position.x = jupiterRef.current.position.x + jupiterConstants.europa.distance * Math.cos((2 * Math.PI * time.current) / jupiterConstants.europa.orbitalPeriod);
        EuropaRef.current.position.z = jupiterRef.current.position.z + jupiterConstants.europa.distance * Math.sin((2 * Math.PI * time.current) / jupiterConstants.europa.orbitalPeriod);
        EuropaRef.current.position.y = jupiterRef.current.position.y  
      }

      if (GanymedeRef.current) {
        GanymedeRef.current.position.x = jupiterRef.current.position.x + jupiterConstants.ganymede.distance * Math.cos((2 * Math.PI * time.current) / jupiterConstants.ganymede.orbitalPeriod);
        GanymedeRef.current.position.z = jupiterRef.current.position.z + jupiterConstants.ganymede.distance * Math.sin((2 * Math.PI * time.current) / jupiterConstants.ganymede.orbitalPeriod);
        GanymedeRef.current.position.y = jupiterRef.current.position.y + jupiterConstants.ganymede.distance * Math.sin((2 * Math.PI * time.current) / jupiterConstants.ganymede.orbitalPeriod)
      }

      if (CallistoRef.current) {
        CallistoRef.current.position.x = jupiterRef.current.position.x + jupiterConstants.callisto.distance * Math.cos((2 * Math.PI * time.current) / jupiterConstants.callisto.orbitalPeriod);
        CallistoRef.current.position.z = jupiterRef.current.position.z + jupiterConstants.callisto.distance * Math.sin((2 * Math.PI * time.current) / jupiterConstants.callisto.orbitalPeriod);
        CallistoRef.current.position.y = jupiterRef.current.position.y + jupiterConstants.callisto.distance * Math.sin((2 * Math.PI * time.current) / jupiterConstants.callisto.orbitalPeriod)*-1
      }

      const axialTilt = jupiterConstants.axialTilt;
      jupiterRef.current.rotation.x = axialTilt;

      jupiterTextRef?.current?.lookAt(camera.position);
      const distance = jupiterRef.current.position.distanceTo(camera.position);
      if (selectedPlanetState !== jupiterConstants.selectedPlanet) {
        if (distance > 15) {
          let textScale = distance / 20;
          jupiterTextRef.current.scale.set(textScale, textScale, textScale);
          jupiterTextRef.current.position.y = 1.25;
        } else {
          jupiterTextRef.current.position.y = 0.85;
          jupiterTextRef.current.scale.set(0.5, 0.5, 0.5);
        }
      }
    }
  });

  const handleClick = () => {
    const num = jupiterConstants.selectedPlanet;
    
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
    setColor(jupiterConstants.hoverColor);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    setColor(jupiterConstants.color);
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
      <ModelProcessor url={require("../Models/Io.glb")}
        scale={jupiterConstants.io.modelScale}
        position={[jupiterConstants.io.distance, 0, 0]}
        ref={IoRef}
      />
      <ModelProcessor
        url={require("../Models/Europa.glb")}
        scale={jupiterConstants.europa.modelScale}
        position={[jupiterConstants.europa.distance, 0, 0]}
        ref={EuropaRef}
      />
      <ModelProcessor
        url={require("../Models/Ganymede.glb")}
        scale={jupiterConstants.ganymede.modelScale}
        position={[jupiterConstants.ganymede.distance, 0, 0]}
        ref={GanymedeRef}
      />
      <ModelProcessor
        url={require("../Models/Callisto.glb")}
        scale={jupiterConstants.callisto.modelScale}
        position={[jupiterConstants.callisto.distance, 0, 0]}
        ref={CallistoRef}
      />
      {selectedPlanetState !== jupiterConstants.selectedPlanet &&
        <Orbit coordinates={JupiterOrbit} color={color} hoverColor={"blue"} thickness={10} />
      }
    </>
  );
}
