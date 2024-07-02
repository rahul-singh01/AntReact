import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import VenusOrbit from '../Constants/venusOrbit.json';
import { venusConstants } from '../Constants/ShapeCoordsContants';

export default function Venus({ venusRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(venusConstants.color);

    useFrame((state, delta) => {
        if (venusRef.current) {
            const orbitalPeriod = venusConstants.orbitalPeriod;

            venusRef.current.rotation.y += venusConstants.rotationSpeed;
            time.current += delta;

            venusRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * venusConstants.majorAxis +venusConstants.offsetX;
            venusRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * venusConstants.minorAxis + venusConstants.offsetZ;
            venusRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(venusConstants.tilt) * venusConstants.majorAxis + venusConstants.offsetY;

            const axialTilt = venusConstants.axialTilt;
            venusRef.current.rotation.x = axialTilt;
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = venusConstants.radius;
        selectedPlanet.current = 2;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

    const handlePointerOver = () => {
        document.body.style.cursor = "pointer";
        setHovered(true);
        setColor(venusConstants.hoverColor);
    };

    const handlePointerOut = () => {
        document.body.style.cursor = "auto";
        setHovered(false);
        setColor(venusConstants.color);
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
            </mesh>
            {showOrbit &&
                <Orbit coordinates={VenusOrbit} color={color} thickness={10} />
            }
        </>
    );
}
