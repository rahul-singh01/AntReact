import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import SaturnOrbit from '../Constants/saturnOrbit.json';
import { saturnConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

export default function Saturn({ saturnRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    let saturntextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(saturnConstants.color);
    const {camera}= useThree();
    useFrame((state, delta) => {
        if (saturnRef.current) {
            const orbitalPeriod = saturnConstants.orbitalPeriod;

            saturnRef.current.rotation.y += saturnConstants.rotationSpeed;
            time.current += delta;

            saturnRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * saturnConstants.majorAxis +saturnConstants.offsetX;
            saturnRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * saturnConstants.minorAxis + saturnConstants.offsetZ;
            saturnRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(saturnConstants.tilt) * saturnConstants.majorAxis + saturnConstants.offsetY;

            const axialTilt = saturnConstants.axialTilt;
            saturnRef.current.rotation.x = axialTilt;

            saturntextRef?.current?.lookAt(camera.position);
            const distance = saturnRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
                    let textScale = distance / 20;
                    saturntextRef.current.scale.set(textScale, textScale, textScale);
                    saturntextRef.current.position.y = 0.45 * textScale;
                } else {
                    saturntextRef.current.position.y = 0.75;
                    saturntextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = saturnConstants.radius;
        selectedPlanet.current = saturnConstants.selectedPlanet;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

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
                        ref={saturntextRef}
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
