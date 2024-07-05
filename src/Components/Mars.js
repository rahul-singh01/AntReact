import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import MarsOrbit from '../Constants/marsOrbit.json';
import PhobosOrbit from '../Constants/phobosOrbit.json';
import { marsConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateMarsPosition() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
  const yearLength = 687;
  const meanAnomaly = (2 * Math.PI * dayOfYear) / yearLength;

  const eccentricity = 0.0934;

  let E = meanAnomaly;
  for (let i = 0; i < 5; i++) {
    E = meanAnomaly + eccentricity * Math.sin(E);
  }
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  );

  return {
    x: Math.cos(trueAnomaly) * marsConstants.majorAxis + marsConstants.offsetX,
    y: Math.sin(trueAnomaly) * Math.tan(marsConstants.tilt) * marsConstants.majorAxis + marsConstants.offsetY,
    z: Math.sin(trueAnomaly) * marsConstants.minorAxis + marsConstants.offsetZ,
  };
}

export default function Mars({ marsRef, followPlanetRef, radiusRef, selectedPlanet, setSelectedPlanetState, selectedPlanetState }) {
  let time = useRef(0);
  let marsTextRef = useRef(null);
  const [showOrbit, setShowOrbit] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(marsConstants.color);
  const { camera } = useThree();
  const phobosRef = useRef(null);
  const deimosRef = useRef(null);
  useEffect(() => {
    const initialPosition = calculateMarsPosition();
    if (marsRef.current) {
      marsRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    }
  }, []);

  useFrame((state, delta) => {
    if (marsRef.current) {
      const orbitalPeriod = marsConstants.orbitalPeriod;

      marsRef.current.rotation.y += marsConstants.rotationSpeed;
      time.current += delta;

      marsRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * marsConstants.majorAxis + marsConstants.offsetX;
      marsRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * marsConstants.minorAxis + marsConstants.offsetZ;
      marsRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(marsConstants.tilt) * marsConstants.majorAxis + marsConstants.offsetY;

      if (phobosRef.current) {
        const phobosAngle = ( Math.PI * time.current) / (30*marsConstants.phobos.orbitalPeriod);
        phobosRef.current.position.x = marsRef.current.position.x + marsConstants.phobos.majorAxis * Math.cos(phobosAngle);
        phobosRef.current.position.z = marsRef.current.position.z + marsConstants.phobos.minorAxis * Math.sin(phobosAngle);
        phobosRef.current.position.y = marsRef.current.position.y + marsConstants.phobos.distance * Math.cos(phobosAngle) 
        phobosRef.current.rotation.y += marsConstants.phobos.rotationSpeed;
    }
    
    if (deimosRef.current) {
        const deimosAngle = ( Math.PI * time.current) / (20*marsConstants.phobos.orbitalPeriod);
        deimosRef.current.position.x = marsRef.current.position.x + marsConstants.deimos.majorAxis * Math.cos(deimosAngle);
        deimosRef.current.position.z = marsRef.current.position.z + marsConstants.deimos.minorAxis * Math.sin(deimosAngle);
        deimosRef.current.position.y = marsRef.current.position.y + marsConstants.deimos.distance * Math.sin(deimosAngle) * Math.sin(marsConstants.deimos.tilt);
        deimosRef.current.rotation.y += marsConstants.deimos.rotationSpeed;
    }

      const axialTilt = marsConstants.axialTilt;
      marsRef.current.rotation.x = axialTilt;

      marsTextRef?.current?.lookAt(camera.position);

      const distance = marsRef.current.position.distanceTo(camera.position);
      if (showOrbit) {
        if (distance > 20) {
          let textScale = distance / 20;
          marsTextRef.current.scale.set(textScale, textScale, textScale);
          marsTextRef.current.position.y = 0.45 * textScale;
        } else {
          marsTextRef.current.position.y = 0.75;
          marsTextRef.current.scale.set(0.5, 0.5, 0.5);
        }
      }
    }
  });

  const handleClick = () => {
    setShowOrbit(!showOrbit);
    const num = marsConstants.selectedPlanet;
    selectedPlanet.current = marsConstants.selectedPlanet;
    setSelectedPlanetState((prev) => {
      if (prev === marsConstants.selectedPlanet) {
        return 0;
      }
      return marsConstants.selectedPlanet;
    })
    radiusRef.current = marsConstants.selectedPlanet;
    followPlanetRef.current = (selectedPlanetState === num) ? (followPlanetRef.current + 1) % 3 : 1;
  };

  const handlePointerOver = () => {
    setHovered(true);
    setColor(marsConstants.hoverColor);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    setColor(marsConstants.color);
    document.body.style.cursor = "auto";
  };

  return (
    <>
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        ref={marsRef}
        style={{ cursor: hovered ? "pointer" : "auto" }}
      >
        <ModelProcessor
          url={require("../Models/Mars.glb")}
          scale={[0.08, 0.08, 0.08]}
          position={[0, 0, 0]}
          ref={marsRef}
        />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={hovered ? 10 : 1}
          attach="material"
        />
        {selectedPlanetState !== marsConstants.selectedPlanet &&
          <Text
            position={[0, 1, 0]}
            fontSize={0.5}
            color={hovered ? marsConstants.textHoverColor : marsConstants.textNormalColor}
            anchorX="center"
            anchorY="middle"
            rotation={[0, 0, 0]}
            ref={marsTextRef}
          >
            Mars
          </Text>
        }
        
      </mesh>
      <ModelProcessor
        url={require("../Models/Phobos.glb")}
        scale={marsConstants.phobos.modelScale}
        position={[0.5, 0, 0]}
        ref={phobosRef}
      />
      <ModelProcessor
        url={require("../Models/Deimos.glb")}
        scale={marsConstants.deimos.modelScale}
        position={[-0.5, 0, 0]}
        ref={deimosRef}
      />
      {selectedPlanetState !== marsConstants.selectedPlanet &&
        <Orbit coordinates={MarsOrbit} color={color} hoverColor={"blue"} thickness={10} />
      }
    </>
  );
}
