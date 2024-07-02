import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import MercuryOrbit from '../Constants/mercuryOrbit.json';
import { mercuryConstants } from '../Constants/ShapeCoordsContants';
export default function Mercury({ mercuryRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(mercuryConstants.color);

    useFrame((state, delta) => {
        if (mercuryRef.current) {
            const orbitalPeriod = mercuryConstants.orbitalPeriod;

            mercuryRef.current.rotation.y += mercuryConstants.rotationSpeed;
            time.current += delta;

            mercuryRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * mercuryConstants.majorAxis + mercuryConstants.offsetX;
            mercuryRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * mercuryConstants.minorAxis;
            mercuryRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(mercuryConstants.tilt) * mercuryConstants.majorAxis;

            mercuryRef.current.rotation.x = mercuryConstants.axialTilt;
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = mercuryConstants.radius;
        selectedPlanet.current = mercuryConstants.selectedPlanet;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

    const handlePointerOver = () => {
        setHovered(true);
        setColor(mercuryConstants.hoverColor);
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        setHovered(false);
        setColor(mercuryConstants.color);
        document.body.style.cursor = "auto";
    };

    return (
        <>
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                ref={mercuryRef}
                style={{ cursor: hovered ? "pointer" : "auto" }}
            >
                <ModelProcessor
                    url={require("../Models/Mercury.glb")}
                    scale={mercuryConstants.modelScale}
                    position={[0, 0, 0]}
                    ref={mercuryRef}
                />
                <meshStandardMaterial
                    emissive={color}
                    emissiveIntensity={hovered ? 10 : 1}
                    attach="material"
                />
            </mesh>
            {showOrbit &&
                <Orbit coordinates={MercuryOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
