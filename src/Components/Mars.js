import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import MarsOrbit from '../Constants/marsOrbit.json';
import { marsConstants } from '../Constants/ShapeCoordsContants';

export default function Mars({ marsRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(marsConstants.color);

    useFrame((state, delta) => {
        if (marsRef.current) {
            const orbitalPeriod = marsConstants.orbitalPeriod;

            marsRef.current.rotation.y += marsConstants.rotationSpeed;
            time.current += delta;

            marsRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * marsConstants.majorAxis +marsConstants.offsetX;
            marsRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * marsConstants.minorAxis + marsConstants.offsetZ;
            marsRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(marsConstants.tilt) * marsConstants.majorAxis + marsConstants.offsetY;

            const axialTilt = marsConstants.axialTilt;
            marsRef.current.rotation.x = axialTilt;
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = marsConstants.selectedPlanet;
        selectedPlanet.current = 4;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
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
            </mesh>
            {showOrbit &&
                <Orbit coordinates={MarsOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
