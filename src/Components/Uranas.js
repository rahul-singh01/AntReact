import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import ModelProcessor from '../Utils/ModelProccessor';
import Orbit from './Orbit';
import UranusOrbit from '../Constants/uranusOrbit.json';
import { uranusConstants } from '../Constants/ShapeCoordsContants';
import { Text } from '@react-three/drei';

function calculateUranusPosition() {
    const now = new Date();
    const referenceDate = new Date('2000-01-01T00:00:00Z'); 
    const elapsedTime = (now - referenceDate) / (1000 * 60 * 60 * 24 * 365.25); 
    const orbitalPeriod = uranusConstants.orbitalPeriod;
    const meanAnomaly = (2 * Math.PI * (elapsedTime % orbitalPeriod)) / orbitalPeriod;

    const eccentricity = 0.0457; 

    let E = meanAnomaly;
    for (let i = 0; i < 5; i++) {
        E = meanAnomaly + eccentricity * Math.sin(E);
    }

    const trueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
        Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
    );

    return {
        x: Math.cos(trueAnomaly) * uranusConstants.majorAxis + uranusConstants.offsetX,
        y: Math.sin(trueAnomaly) * Math.tan(uranusConstants.tilt) * uranusConstants.majorAxis + uranusConstants.offsetY,
        z: Math.sin(trueAnomaly) * uranusConstants.minorAxis + uranusConstants.offsetZ,
    };
}

export default function Uranus({ uranusRef, followPlanetRef, radiusRef, selectedPlanet, setSelectedPlanetState, selectedPlanetState}) {
    const time = useRef(Date.now());
    const uranusTextRef = useRef(null);
    const [showOrbit, setShowOrbit] = useState(true);
    const [hovered, setHovered] = useState(false);
    const [color, setColor] = useState(uranusConstants.color);
    const { camera } = useThree();
    const titaniaRef = useRef(null);
    const oberonRef = useRef(null);
    const umbrielRef = useRef(null);
    const arielRef = useRef(null);
    useEffect(() => {
        const initialPosition = calculateUranusPosition();
        if (uranusRef.current) {
            uranusRef.current.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        }
    }, []);

    useFrame((state, delta) => {
        if (uranusRef.current) {
            const orbitalPeriod = uranusConstants.orbitalPeriod;

            uranusRef.current.rotation.y += uranusConstants.rotationSpeed;
            time.current += delta;

            uranusRef.current.position.x = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * uranusConstants.majorAxis + uranusConstants.offsetX;
            uranusRef.current.position.z = Math.sin((2 * Math.PI * time.current) / orbitalPeriod) * uranusConstants.minorAxis + uranusConstants.offsetZ;
            uranusRef.current.position.y = Math.cos((2 * Math.PI * time.current) / orbitalPeriod) * Math.tan(uranusConstants.tilt) * uranusConstants.majorAxis + uranusConstants.offsetY;

            if (titaniaRef.current) {
                titaniaRef.current.rotation.y += uranusConstants.titania.rotationSpeed;
                titaniaRef.current.position.x = uranusRef.current.position.x + uranusConstants.titania.majorAxis * Math.cos((2 * Math.PI * time.current) / uranusConstants.titania.orbitalPeriod);
                titaniaRef.current.position.z = uranusRef.current.position.z + uranusConstants.titania.minorAxis * Math.sin((2 * Math.PI * time.current) / uranusConstants.titania.orbitalPeriod);
                titaniaRef.current.position.y = uranusRef.current.position.y + uranusConstants.titania.distance * Math.cos((2 * Math.PI * time.current) / uranusConstants.titania.orbitalPeriod);
            }

            if (oberonRef.current) {
                oberonRef.current.rotation.y += uranusConstants.oberon.rotationSpeed;
                oberonRef.current.position.x = uranusRef.current.position.x + uranusConstants.oberon.majorAxis * Math.cos((2 * Math.PI * time.current) / uranusConstants.oberon.orbitalPeriod);
                oberonRef.current.position.z = uranusRef.current.position.z + uranusConstants.oberon.minorAxis * Math.sin((2 * Math.PI * time.current) / uranusConstants.oberon.orbitalPeriod);
                oberonRef.current.position.y = uranusRef.current.position.y + uranusConstants.oberon.distance * Math.sin((2 * Math.PI * time.current) / uranusConstants.oberon.orbitalPeriod);
            }

            if (umbrielRef.current) {
                umbrielRef.current.rotation.y += uranusConstants.umbriel.rotationSpeed;
                umbrielRef.current.position.x = uranusRef.current.position.x + uranusConstants.umbriel.majorAxis * Math.cos((2 * Math.PI * time.current) / uranusConstants.umbriel.orbitalPeriod);
                umbrielRef.current.position.z = uranusRef.current.position.z + uranusConstants.umbriel.minorAxis * Math.sin((2 * Math.PI * time.current) / uranusConstants.umbriel.orbitalPeriod);
                umbrielRef.current.position.y = uranusRef.current.position.y + uranusConstants.umbriel.distance * Math.sin((2 * Math.PI * time.current) / uranusConstants.umbriel.orbitalPeriod);
            }

            if (arielRef.current) {
                arielRef.current.rotation.y += uranusConstants.ariel.rotationSpeed;
                arielRef.current.position.x = uranusRef.current.position.x + uranusConstants.ariel.majorAxis * Math.cos((2 * Math.PI * time.current) / uranusConstants.ariel.orbitalPeriod);
                arielRef.current.position.z = uranusRef.current.position.z + uranusConstants.ariel.minorAxis * Math.sin((2 * Math.PI * time.current) / uranusConstants.ariel.orbitalPeriod);
                arielRef.current.position.y = uranusRef.current.position.y + uranusConstants.ariel.distance 
            }

            const axialTilt = uranusConstants.axialTilt;
            uranusRef.current.rotation.x = axialTilt;

            uranusTextRef?.current?.lookAt(camera.position);
            const distance = uranusRef.current.position.distanceTo(camera.position);
            if (showOrbit) {
                if (distance > 25) {
                    let textScale = distance / 20;
                    uranusTextRef.current.scale.set(textScale, textScale, textScale);
                    uranusTextRef.current.position.y = 1.75
                } else {
                    uranusTextRef.current.position.y = 1.75;
                    uranusTextRef.current.scale.set(1.5, 1.5, 1.5);
                }
            }
        }
    });

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

    const handleClick = () => {
        setShowOrbit(!showOrbit);
        const num = uranusConstants.selectedPlanet;
        selectedPlanet.current = uranusConstants.selectedPlanet;
        setSelectedPlanetState((prev)=>{
            if (prev === uranusConstants.selectedPlanet) {
                return 0;
            }
            return uranusConstants.selectedPlanet;
        
        })
        // setSelectedPlanetState(showOrbit ? selectedPlanet.current : 0);
        radiusRef.current = uranusConstants.radius;
        // followPlanetRef.current = (followPlanetRef.current + 1) % 3;
        followPlanetRef.current =(selectedPlanetState===num)? (followPlanetRef.current + 1) % 3:1;
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
                    selectedPlanetState !== uranusConstants.selectedPlanet &&
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
            <ModelProcessor
                url={require("../Models/Titania.glb")}
                scale={uranusConstants.titania.modelScale}
                position={[0, 0, 0]}
                ref={titaniaRef}
            />
            <ModelProcessor
                url={require("../Models/Oberon.glb")}
                scale={uranusConstants.oberon.modelScale}
                position={[0, 0, 0]}
                ref={oberonRef}
            />
            <ModelProcessor
                url={require("../Models/Umbriel.glb")}
                scale={uranusConstants.umbriel.modelScale}
                position={[0, 0, 0]}
                ref={umbrielRef}
            />
            <ModelProcessor
                url={require("../Models/Ariel.glb")}
                scale={uranusConstants.ariel.modelScale}
                position={[0, 0, 0]}
                ref={arielRef}
            />
            {selectedPlanetState !== uranusConstants.selectedPlanet &&
                <Orbit coordinates={UranusOrbit} color={color} hoverColor={"blue"} thickness={10} />
            }
        </>
    );
}
