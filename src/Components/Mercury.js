import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import MercuryOrbit from '../Constants/mercuryOrbit.json';
import { mercuryConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';
export default function Mercury({ mercuryRef, followPlanetRef, radiusRef, selectedPlanet }) {
    let time = useRef(0);
    let mercurytextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(mercuryConstants.color);
    const {camera}= useThree();
    useFrame((state, delta) => {
        if (mercuryRef.current) {
            const orbitalPeriod = mercuryConstants.orbitalPeriod;

            mercuryRef.current.rotation.y += mercuryConstants.rotationSpeed;
            time.current += delta;

            mercuryRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * mercuryConstants.majorAxis + mercuryConstants.offsetX;
            mercuryRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * mercuryConstants.minorAxis;
            mercuryRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(mercuryConstants.tilt) * mercuryConstants.majorAxis;

            mercuryRef.current.rotation.x = mercuryConstants.axialTilt;

            mercurytextRef?.current?.lookAt(camera.position);
            
            const distance = mercuryRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 35) {
                    let textScale = distance / 20;
                    mercurytextRef.current.scale.set(textScale, textScale, textScale);
                    mercurytextRef.current.position.y = 0.45 * textScale;
                } else {
                    mercurytextRef.current.position.y = 0.75;
                    mercurytextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
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
                {
                    showOrbit &&
                    <Text

                        position={[0, 1, 0]}
                        fontSize={0.5}
                        color={hovered ? mercuryConstants.textHoverColor : mercuryConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={mercurytextRef}
                    >
                        Mercury
                    </Text>
                }
            </mesh>
            {showOrbit &&
                <Orbit coordinates={MercuryOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
