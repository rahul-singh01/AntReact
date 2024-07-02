import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import NeptuneOrbit from '../Constants/neptuneOrbit.json';
import { neptuneConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

export default function Neptune({ neptuneRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    let neptuneTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(neptuneConstants.color);
    const {camera}= useThree();
    useFrame((state, delta) => {
        if (neptuneRef.current) {
            const orbitalPeriod = neptuneConstants.orbitalPeriod;

            neptuneRef.current.rotation.y += neptuneConstants.rotationSpeed;
            time.current += delta;

            neptuneRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * neptuneConstants.majorAxis +neptuneConstants.offsetX;
            neptuneRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * neptuneConstants.minorAxis + neptuneConstants.offsetZ;
            neptuneRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(neptuneConstants.tilt) * neptuneConstants.majorAxis + neptuneConstants.offsetY;

            const axialTilt = neptuneConstants.axialTilt;
            neptuneRef.current.rotation.x = axialTilt;

            neptuneTextRef?.current?.lookAt(camera.position);
            const distance = neptuneRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
                    let textScale = distance / 20;
                    neptuneTextRef.current.scale.set(textScale, textScale, textScale);
                    neptuneTextRef.current.position.y = 0.45 * textScale;
                } else {
                    neptuneTextRef.current.position.y = 3.75;
                    neptuneTextRef.current.scale.set(0.95, 0.95, 0.95);
                }
            }
        }
    });

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        radiusRef.current = neptuneConstants.radius;
        selectedPlanet.current = neptuneConstants.selectedPlanet;
        followPlanetRef.current = (followPlanetRef.current + 1) % 3;
    };

    const handlePointerOver = () => {
        setHovered(true);
        setColor(neptuneConstants.hoverColor);
        document.body.style.cursor = "pointer";
    };

    const handlePointerOut = () => {
        setHovered(false);
        setColor(neptuneConstants.color);
        document.body.style.cursor = "auto";
    };

    return (
        <>
            <mesh
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                ref={neptuneRef}
                style={{ cursor: hovered ? "pointer" : "auto" }}
            >
                <ModelProcessor
                    url={require("../Models/Neptune.glb")}
                    scale={neptuneConstants.modelScale}
                    position={[0, 0, 0]}
                    ref={neptuneRef}
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
                        color={hovered ? neptuneConstants.textHoverColor : neptuneConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={neptuneTextRef}
                    >
                        Neptune
                    </Text>
                }
            </mesh>
            {showOrbit &&
                <Orbit coordinates={NeptuneOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
