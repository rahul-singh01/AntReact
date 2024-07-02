import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import MarsOrbit from '../Constants/marsOrbit.json';
import { marsConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

export default function Mars({ marsRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    let marsTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(marsConstants.color);
    const { camera } = useThree();
    useFrame((state, delta) => {
        if (marsRef.current) {
            const orbitalPeriod = marsConstants.orbitalPeriod;

            marsRef.current.rotation.y += marsConstants.rotationSpeed;
            time.current += delta;

            marsRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * marsConstants.majorAxis + marsConstants.offsetX;
            marsRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * marsConstants.minorAxis + marsConstants.offsetZ;
            marsRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(marsConstants.tilt) * marsConstants.majorAxis + marsConstants.offsetY;
            const axialTilt = marsConstants.axialTilt;
            marsRef.current.rotation.x = axialTilt;

            marsTextRef?.current?.lookAt(camera.position);
            
            const distance = marsRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
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
                {
                    showOrbit &&
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
            {showOrbit &&
                <Orbit coordinates={MarsOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
