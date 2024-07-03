import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import SaturnOrbit from '../Constants/saturnOrbit.json';
import { saturnConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateSaturnPosition() {
    const now = new Date();
    const referenceDate = new Date('2000-01-01T00:00:00Z'); 
    const elapsedTime = (now - referenceDate) / (1000 * 60 * 60 * 24 * 365.25);
    const orbitalPeriod = saturnConstants.orbitalPeriod;
    const meanAnomaly = (2 * Math.PI * (elapsedTime % orbitalPeriod)) / orbitalPeriod;

    const eccentricity = 0.0565;

    let E = meanAnomaly;
    for (let i = 0; i < 5; i++) {
        E = meanAnomaly + eccentricity * Math.sin(E);
    }

    const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );

    return {
        x: Math.cos(trueAnomaly) * saturnConstants.majorAxis + saturnConstants.offsetX,
        y: Math.sin(trueAnomaly) * Math.tan(saturnConstants.tilt) * saturnConstants.majorAxis + saturnConstants.offsetY,
        z: Math.sin(trueAnomaly) * saturnConstants.minorAxis + saturnConstants.offsetZ,
    };
}

export default function Saturn({ saturnRef, followPlanetRef, radiusRef, selectedPlanet }) {
    const time = useRef(Date.now());
    const saturnTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(saturnConstants.color);
    const { camera } = useThree();

    useEffect(() => {
        const initialPosition = calculateSaturnPosition();
        if (saturnRef.current) {
            saturnRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        }
    }, []);

    useFrame((state, delta) => {
        if (saturnRef.current) {
            const orbitalPeriod = saturnConstants.orbitalPeriod;

            saturnRef.current.rotation.y += saturnConstants.rotationSpeed;
            time.current += delta;

            saturnRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * saturnConstants.majorAxis + saturnConstants.offsetX;
            saturnRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * saturnConstants.minorAxis + saturnConstants.offsetZ;
            saturnRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(saturnConstants.tilt) * saturnConstants.majorAxis + saturnConstants.offsetY;

            const axialTilt = saturnConstants.axialTilt;
            saturnRef.current.rotation.x = axialTilt;

            saturnTextRef?.current?.lookAt(camera.position);
            const distance = saturnRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
                    let textScale = distance / 20;
                    saturnTextRef.current.scale.set(textScale, textScale, textScale);
                    saturnTextRef.current.position.y = 0.45 * textScale;
                } else {
                    saturnTextRef.current.position.y = 0.75;
                    saturnTextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
        }
    });

    const handlePointerOver = () => {
        setHovered(true);
        setColor(saturnConstants.hoverColor);
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        setHovered(false);
        setColor(saturnConstants.color);
        document.body.style.cursor = "auto";
    };

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = saturnConstants.radius;
        selectedPlanet.current = saturnConstants.selectedPlanet;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

    return (
        <>
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                ref={saturnRef}
                style={{ cursor: hovered ? "pointer" : "auto" }}
            >
                <ModelProcessor
                    url={require("../Models/Saturn.glb")}
                    scale={saturnConstants.modelScale}
                    position={[0, 0, 0]}
                    ref={saturnRef}
                />
                <meshStandardMaterial
                    emissive={color}
                    emissiveIntensity={hovered ? 10 : 1}
                    attach="material"
                />
                {
                    showOrbit &&
                    <Text
                        position={[0, 1, 0]}
                        fontSize={0.5}
                        color={hovered ? saturnConstants.textHoverColor : saturnConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={saturnTextRef}
                    >
                        Saturn
                    </Text>
                }
            </mesh>
            {showOrbit &&
                <Orbit coordinates={SaturnOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
