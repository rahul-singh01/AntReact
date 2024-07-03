import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import VenusOrbit from '../Constants/venusOrbit.json';
import { venusConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateVenusPosition() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const yearLength = 365.25;
    const meanAnomaly = (2 * Math.PI * dayOfYear) / yearLength;

    const eccentricity = 0.0067; 

    let E = meanAnomaly;
    for (let i = 0; i < 5; i++) {
        E = meanAnomaly + eccentricity * Math.sin(E);
    }

    const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );

    return {
        x: Math.cos(trueAnomaly) * venusConstants.majorAxis + venusConstants.offsetX,
        y: Math.sin(trueAnomaly) * Math.tan(venusConstants.tilt) * venusConstants.majorAxis + venusConstants.offsetY,
        z: Math.sin(trueAnomaly) * venusConstants.minorAxis + venusConstants.offsetZ,
    };
}

export default function Venus({ venusRef, followPlanetRef, radiusRef, selectedPlanet }) {
    const time = useRef(Date.now());
    const venusTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(venusConstants.color);
    const { camera } = useThree();

    useEffect(() => {
        const initialPosition = calculateVenusPosition();
        if (venusRef.current) {
            venusRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        }
    }, []);

    useFrame((state, delta) => {
        if (venusRef.current) {
            const orbitalPeriod = venusConstants.orbitalPeriod;

            venusRef.current.rotation.y += venusConstants.rotationSpeed;
            time.current += delta;

            venusRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * venusConstants.majorAxis + venusConstants.offsetX;
            venusRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * venusConstants.minorAxis + venusConstants.offsetZ;
            venusRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(venusConstants.tilt) * venusConstants.majorAxis + venusConstants.offsetY;

            const axialTilt = venusConstants.axialTilt;
            venusRef.current.rotation.x = axialTilt;

            venusTextRef?.current?.lookAt(camera.position);
            const distance = venusRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
                    let textScale = distance / 20;
                    venusTextRef.current.scale.set(textScale, textScale, textScale);
                    venusTextRef.current.position.y = 0.45 * textScale;
                } else {
                    venusTextRef.current.position.y = 0.75;
                    venusTextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = venusConstants.radius;
        selectedPlanet.current = 2;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

    const handlePointerOver = () => {
        setHovered(true);
        setColor(venusConstants.hoverColor);
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        setHovered(false);
        setColor(venusConstants.color);
        document.body.style.cursor = "auto";
    };

    return (
        <>
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                ref={venusRef}
                style={{ cursor: hovered ? "pointer" : "auto" }}
            >
                <ModelProcessor
                    url={require("../Models/Venus.glb")}
                    scale={venusConstants.modelScale}
                    position={[0, 0, 0]}
                    ref={venusRef}
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
                        color={hovered ? venusConstants.textHoverColor : venusConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={venusTextRef}
                    >
                        Venus
                    </Text>
                }
            </mesh>
            {showOrbit &&
                <Orbit coordinates={VenusOrbit} color={color} thickness={10} />
            }
        </>
    );
}
