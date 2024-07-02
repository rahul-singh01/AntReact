import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import JupiterOrbit from '../Constants/jupiterOrbit.json';
import { jupiterConstants } from '../Constants/ShapeCoordsContants';

export default function Jupiter({ jupiterRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState("yellow");

    useFrame((state, delta) => {
        if (jupiterRef.current) {
            const orbitalPeriod = jupiterConstants.orbitalPeriod;

            jupiterRef.current.rotation.y += jupiterConstants.rotationSpeed;
            time.current += delta;

            jupiterRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * jupiterConstants.majorAxis +jupiterConstants.offsetX;
            jupiterRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * jupiterConstants.minorAxis + jupiterConstants.offsetZ;
            jupiterRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(jupiterConstants.tilt) * jupiterConstants.majorAxis + jupiterConstants.offsetY;

            const axialTilt = jupiterConstants.axialTilt;
            jupiterRef.current.rotation.x = axialTilt;
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = jupiterConstants.radius;
        selectedPlanet.current = jupiterConstants.selectedPlanet;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
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
            </mesh>
            {showOrbit &&
                <Orbit coordinates={JupiterOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
