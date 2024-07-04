import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import MercuryOrbit from '../Constants/mercuryOrbit.json';
import { mercuryConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateMercuryPosition() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const yearLength = 88;
    const meanAnomaly = (2 * Math.PI * dayOfYear) / yearLength;

    const eccentricity = 0.2056;

    let E = meanAnomaly;
    for (let i = 0; i < 5; i++) {
        E = meanAnomaly + eccentricity * Math.sin(E);
    }
    const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );

    return {
        x: Math.cos(trueAnomaly) * mercuryConstants.majorAxis + mercuryConstants.offsetX,
        y: Math.sin(trueAnomaly) * Math.tan(mercuryConstants.tilt) * mercuryConstants.majorAxis,
        z: Math.sin(trueAnomaly) * mercuryConstants.minorAxis,
    };
}

export default function Mercury({ mercuryRef, followPlanetRef, radiusRef, selectedPlanet, setSelectedPlanetState, selectedPlanetState }) {
    let time = useRef(0);
    let mercuryTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(mercuryConstants.color);
    const { camera } = useThree();

    useEffect(() => {
        const initialPosition = calculateMercuryPosition();
        if (mercuryRef.current) {
            mercuryRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        }
    }, []);

    useFrame((state, delta) => {
        if (mercuryRef.current) {
            const orbitalPeriod = mercuryConstants.orbitalPeriod;

            mercuryRef.current.rotation.y += mercuryConstants.rotationSpeed;
            time.current += delta;

            mercuryRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * mercuryConstants.majorAxis + mercuryConstants.offsetX;
            mercuryRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * mercuryConstants.minorAxis;
            mercuryRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(mercuryConstants.tilt) * mercuryConstants.majorAxis;

            mercuryRef.current.rotation.x = mercuryConstants.axialTilt;

            mercuryTextRef?.current?.lookAt(camera.position);

            const distance = mercuryRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 25) {
                    let textScale = distance / 20;
                    mercuryTextRef.current.scale.set(textScale, textScale, textScale);
                    mercuryTextRef.current.position.y = 0.45 * textScale;
                } else {
                    mercuryTextRef.current.position.y = 0.75;
                    mercuryTextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
        }
    });

    const handleClick = (num) => {
        setShowOrbit(!showOrbit);
        selectedPlanet.current = mercuryConstants.selectedPlanet;
        setSelectedPlanetState((prev)=>{
            if (prev === num) {
                return 0;
            }
            return num;
        });
        
        // setSelectedPlanetState(showOrbit ? selectedPlanet.current : 0);
        radiusRef.current = mercuryConstants.radius;
        followPlanetRef.current =(selectedPlanetState===num)? (followPlanetRef.current + 1) % 3:1;
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
                onClick={()=>{handleClick(mercuryConstants.selectedPlanet)}}
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
                {selectedPlanetState!=mercuryConstants.selectedPlanet &&
                    <Text
                        position={[0, 1, 0]}
                        fontSize={0.5}
                        color={hovered ? mercuryConstants.textHoverColor : mercuryConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={mercuryTextRef}
                    >
                        Mercury
                    </Text>
                }
            </mesh>
            {selectedPlanetState!=mercuryConstants.selectedPlanet &&
                <Orbit coordinates={MercuryOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
