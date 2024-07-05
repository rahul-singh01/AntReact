import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const CustomControls = ({ followPlanetRef, planetRefs, radiusRef, selectedPlanetRef, setSelectedPlanetState }) => {
    const sphericalCoordsRef = useRef({ theta: 0, phi: 0, r: 5 });
    const { camera, gl } = useThree();
    const controls = useRef();
    const isDragging = useRef(false);
    const startMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        controls.current = new OrbitControls(camera, gl.domElement);
        controls.current.maxDistance = 450; 
        return () => {
            controls.current.dispose();
        };
    }, [camera, gl]);

    const handleInteractionStart = (event) => {
        isDragging.current = true;
        const x = event.clientX || event.touches[0].clientX;
        const y = event.clientY || event.touches[0].clientY;
        startMousePosition.current = { x, y };
    };

    const handleInteractionEnd = () => {
        isDragging.current = false;
    };

    const handleInteractionMove = (event) => {
        if (isDragging.current) {
            const x = event.clientX || event.touches[0].clientX;
            const y = event.clientY || event.touches[0].clientY;
            const deltaX = x - startMousePosition.current.x;
            const deltaY = y - startMousePosition.current.y;
            startMousePosition.current = { x, y };
            sphericalCoordsRef.current.theta = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, sphericalCoordsRef.current.theta - deltaY * 0.00421));
            sphericalCoordsRef.current.phi += deltaX * 0.00421;
        }
    };

    const handleWheel = (event) => {
        const newR = sphericalCoordsRef.current.r + event.deltaY * 0.01;
        const cameraPosition = camera.position.clone();
        const distanceFromOrigin = cameraPosition.length(); 
        if (distanceFromOrigin < 450 || event.deltaY < 0) {
            sphericalCoordsRef.current.r = newR;
        }
        sphericalCoordsRef.current.r = THREE.MathUtils.clamp(sphericalCoordsRef.current.r, radiusRef.current / 2, 450);
    };

    useEffect(() => {
        const domElement = gl.domElement;
        domElement.addEventListener('mousedown', handleInteractionStart);
        domElement.addEventListener('mouseup', handleInteractionEnd);
        domElement.addEventListener('mousemove', handleInteractionMove);
        domElement.addEventListener('touchstart', handleInteractionStart);
        domElement.addEventListener('touchend', handleInteractionEnd);
        domElement.addEventListener('touchmove', handleInteractionMove);
        domElement.addEventListener('wheel', handleWheel);

        return () => {
            domElement.removeEventListener('mousedown', handleInteractionStart);
            domElement.removeEventListener('mouseup', handleInteractionEnd);
            domElement.removeEventListener('mousemove', handleInteractionMove);
            domElement.removeEventListener('touchstart', handleInteractionStart);
            domElement.removeEventListener('touchend', handleInteractionEnd);
            domElement.removeEventListener('touchmove', handleInteractionMove);
            domElement.removeEventListener('wheel', handleWheel);
        };
    }, [gl]);

    useFrame(() => {
        const selectedPlanet = selectedPlanetRef.current;
        const planetRef = planetRefs[selectedPlanet];
        if (controls.current) {
            const followPlanet = followPlanetRef.current;
            if (followPlanet === 1) {
                const { x, y, z } = planetRef.current.position;
                const targetPosition = new THREE.Vector3(x, y, z);
                camera.lookAt(targetPosition);
                controls.current.target.lerp(targetPosition, 1);
                camera.position.lerp(targetPosition.clone(), 0.1);
                const radius = radiusRef.current;
                if (camera.position.distanceTo(targetPosition) < radius) {
                    const r = camera.position.distanceTo(targetPosition);
                    const theta = Math.acos((camera.position.y - targetPosition.y) / r);
                    const phi = Math.atan2(camera.position.z - targetPosition.z, camera.position.x - targetPosition.x);
                    sphericalCoordsRef.current = { theta, phi, r };
                    followPlanetRef.current = 2;
                }
            } else if (followPlanet === 2) {
                setSelectedPlanetState(selectedPlanet);
                const { x, y, z } = planetRef.current.position;
                const { theta, phi, r } = sphericalCoordsRef.current;

                const newPosition = new THREE.Vector3(
                    x + r * Math.sin(theta) * Math.cos(phi),
                    y + r * Math.cos(theta),
                    z + r * Math.sin(theta) * Math.sin(phi)
                );

                controls.current.object.position.copy(newPosition);
                controls.current.target.set(x, y, z);
            } else {
                controls?.current?.target?.set(0, 0, 0);
            }
            controls.current.update();
        } else {
            controls?.current?.target?.set(0, 0, 0);
            // camera.lookAt(0, 0, 0);
            // camera.translateX(20);
            // camera.translateZ(20);
            // camera.translateY(20);
            controls?.current?.update();
        }
    });

    return null;
};

export default CustomControls;
