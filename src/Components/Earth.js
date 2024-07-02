import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import * as THREE from 'three';
import Orbit from './Orbit';
import EarthOrbit from '../Constants/earthOrbit.json'
import { earthConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';
export default function Earth({ earthRef, followPlanetRef, radiusRef, selectedPlanet }) {
  const time = useRef(Date.now());
  const earthTextRef = useRef(null);
  const [showOrbit, setShowOrbit] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [color, setColor] = useState(earthConstants.color);
  const {camera} = useThree();
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

            earthTextRef?.current?.lookAt(camera.position);
            const distance = earthRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
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
        {
                    showOrbit &&
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
      {showOrbit &&
        <Orbit coordinates={EarthOrbit} color={color} hoverColor={"green"} thickness={10} />
      }
    </>
  );
}
