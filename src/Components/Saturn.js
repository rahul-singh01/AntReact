import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import SaturnOrbit from '../Constants/saturnOrbit.json';
import { saturnConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateSaturnPosition() {
    const now = new Date();
    const referenceDate = new Date('2000-01-01T00:00:00Z'); 
    const elapsedTime = (now - referenceDate) / (1000 * 60 * 60 * 24 * 365.25);
    const orbitalPeriod = saturnConstants.orbitalPeriod;
    const meanAnomaly = (2 * Math.PI * (elapsedTime % orbitalPeriod)) / orbitalPeriod;

    const eccentricity = 0.0565;

    let E = meanAnomaly;
    for (let i = 0; i < 5; i++) {
        E = meanAnomaly + eccentricity * Math.sin(E);
    }

    const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );

    return {
        x: Math.cos(trueAnomaly) * saturnConstants.majorAxis + saturnConstants.offsetX,
        y: Math.sin(trueAnomaly) * Math.tan(saturnConstants.tilt) * saturnConstants.majorAxis + saturnConstants.offsetY,
        z: Math.sin(trueAnomaly) * saturnConstants.minorAxis + saturnConstants.offsetZ,
    };
}

export default function Saturn({ saturnRef, followPlanetRef, radiusRef, selectedPlanet, setSelectedPlanetState, selectedPlanetState}) {
    const time = useRef(Date.now());
    const saturnTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(saturnConstants.color);
    const { camera } = useThree();
    const titanRef = useRef(null);
    const rheaRef = useRef(null);
    const iapetusRef = useRef(null);
    useEffect(() => {
        const initialPosition = calculateSaturnPosition();
        if (saturnRef.current) {
            saturnRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        }
    }, []);

    useFrame((state, delta) => {
        if (saturnRef.current) {
            const orbitalPeriod = saturnConstants.orbitalPeriod;

            saturnRef.current.rotation.y += saturnConstants.rotationSpeed;
            time.current += delta;

            saturnRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * saturnConstants.majorAxis + saturnConstants.offsetX;
            saturnRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * saturnConstants.minorAxis + saturnConstants.offsetZ;
            saturnRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(saturnConstants.tilt) * saturnConstants.majorAxis + saturnConstants.offsetY;
            
            if (titanRef.current) {
                const titanAngle = ( Math.PI * time.current) / (3*saturnConstants.titan.orbitalPeriod);
                titanRef.current.position.x = saturnRef.current.position.x + saturnConstants.titan.majorAxis * Math.cos(titanAngle);
                titanRef.current.position.z = saturnRef.current.position.z + saturnConstants.titan.minorAxis * Math.sin(titanAngle);
                titanRef.current.position.y = saturnRef.current.position.y + saturnConstants.titan.majorAxis * Math.tan(saturnConstants.titan.tilt) * Math.cos(titanAngle);
                titanRef.current.rotation.y += saturnConstants.titan.rotationSpeed;
            }
            
            if (rheaRef.current) {
                const rheaAngle = ( Math.PI * time.current) / (4*saturnConstants.rhea.orbitalPeriod);
                rheaRef.current.position.x = saturnRef.current.position.x + saturnConstants.rhea.majorAxis * Math.cos(rheaAngle);
                rheaRef.current.position.z = saturnRef.current.position.z + saturnConstants.rhea.minorAxis * Math.sin(rheaAngle);
                rheaRef.current.position.y = saturnRef.current.position.y + saturnConstants.rhea.majorAxis * Math.tan(saturnConstants.rhea.tilt) * Math.cos(rheaAngle);
                rheaRef.current.rotation.y += saturnConstants.rhea.rotationSpeed;
            }

            if (iapetusRef.current) {
                const iapetusAngle = ( Math.PI * time.current) / (79*saturnConstants.iapetus.orbitalPeriod);
                iapetusRef.current.position.x = saturnRef.current.position.x + saturnConstants.iapetus.majorAxis * Math.cos(iapetusAngle);
                iapetusRef.current.position.z = saturnRef.current.position.z + saturnConstants.iapetus.minorAxis * Math.sin(iapetusAngle);
                iapetusRef.current.position.y = saturnRef.current.position.y + saturnConstants.iapetus.majorAxis * Math.tan(saturnConstants.iapetus.tilt) * Math.cos(iapetusAngle);
                iapetusRef.current.rotation.y += saturnConstants.iapetus.rotationSpeed;
            }
            
            const axialTilt = saturnConstants.axialTilt;
            saturnRef.current.rotation.x = axialTilt;

            saturnTextRef?.current?.lookAt(camera.position);
            const distance = saturnRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 15) {
                    let textScale = distance / 20;
                    saturnTextRef.current.scale.set(textScale, textScale, textScale);
                    saturnTextRef.current.position.y = 0.45 * textScale;
                } else {
                    saturnTextRef.current.position.y = 0.75;
                    saturnTextRef.current.scale.set(0.5, 0.5, 0.5);
                }
            }
        }
    });

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

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        const num = saturnConstants.selectedPlanet;
        selectedPlanet.current = saturnConstants.selectedPlanet;
        setSelectedPlanetState((prev)=>{
            if (prev === saturnConstants.selectedPlanet) {
                return 0;
            } else {
                return saturnConstants.selectedPlanet;
            }
        })
        // setSelectedPlanetState(showOrbit ? selectedPlanet.current : 0);
        radiusRef.current = saturnConstants.radius;
        // followPlanetRef.current = (followPlanetRef.current + 1) % 3;
        followPlanetRef.current =(selectedPlanetState===num)? (followPlanetRef.current + 1) % 3:1;
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
                    selectedPlanetState !== saturnConstants.selectedPlanet &&
                    <Text
                        position={[0, 1, 0]}
                        fontSize={0.5}
                        color={hovered ? saturnConstants.textHoverColor : saturnConstants.textNormalColor}
                        anchorX="center"
                        anchorY="middle"
                        rotation={[0, 0, 0]}
                        ref={saturnTextRef}
                    >
                        Saturn
                    </Text>
                }
            </mesh>
            <ModelProcessor 
                url={require("../Models/Titan.glb")}
                scale={saturnConstants.titan.modelScale}
                position={[0, 0, 0]}
                ref={titanRef}
            />
            <ModelProcessor
                url={require("../Models/Rhea.glb")}
                scale={saturnConstants.rhea.modelScale}
                position={[0, 0, 0]}
                ref={rheaRef}
            />
            <ModelProcessor
                url={require("../Models/Lapetus.glb")}
                scale={saturnConstants.iapetus.modelScale}
                position={[0, 0, 0]}
                ref={iapetusRef}
            />
            {selectedPlanetState !== saturnConstants.selectedPlanet &&
                <Orbit coordinates={SaturnOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
