import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import UranasOrbit from '../Constants/uranusOrbit.json';
import { uranusConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

export default function Uranas({ uranusRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    let uranusTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(uranusConstants.color);
    const {camera} = useThree();
    useFrame((state, delta) => {
        if (uranusRef.current) {
            const orbitalPeriod = uranusConstants.orbitalPeriod;

            uranusRef.current.rotation.y += uranusConstants.rotationSpeed;
            time.current += delta;

            uranusRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * uranusConstants.majorAxis + uranusConstants.offsetX;
            uranusRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * uranusConstants.minorAxis + uranusConstants.offsetZ;
            uranusRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(uranusConstants.tilt) * uranusConstants.majorAxis + uranusConstants.offsetY;

            const axialTilt = uranusConstants.axialTilt;
            uranusRef.current.rotation.x = axialTilt;

            uranusTextRef?.current?.lookAt(camera.position);
            const distance = uranusRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
                    let textScale = distance / 20;
                    uranusTextRef.current.scale.set(textScale, textScale, textScale);
                    uranusTextRef.current.position.y = 0.45 * textScale;
                } else {
                    uranusTextRef.current.position.y = 1.75;
                    uranusTextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = uranusConstants.radius;
        selectedPlanet.current = uranusConstants.selectedPlanet;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

    const handlePointerOver = () => {
        setHovered(true);
        setColor(uranusConstants.hoverColor);
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        setHovered(false);
        setColor(uranusConstants.color);
        document.body.style.cursor = "auto";
    };

    return (
        <>
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                ref={uranusRef}
                style={{ cursor: hovered ? "pointer" : "auto" }}
            >
                <ModelProcessor
                    url={require("../Models/Uranas.glb")}
                    scale={uranusConstants.modelScale}
                    position={[0, 0, 0]}
                    ref={uranusRef}
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
                        color={hovered ? uranusConstants.textHoverColor : uranusConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={uranusTextRef}
                    >
                        Uranus
                    </Text>
                }
            </mesh>
            {showOrbit &&
                <Orbit coordinates={UranasOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
