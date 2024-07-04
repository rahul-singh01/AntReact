import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const Orbit = ({ coordinates, color }) => {
    const [hovered, setHovered] = useState(false);
    const lineRef = useRef();

    const orbitGeometry = useMemo(() => {
        const points = coordinates.map(coord => new THREE.Vector3(coord.x, coord.y, coord.z));
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [coordinates]);

    const material = useMemo(() => new THREE.LineBasicMaterial({ color }), [color]);
    const hoverMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: 0xff0000 }), []);

    useFrame(() => {
        if (hovered) {
            lineRef.current.material = hoverMaterial;
        } else {
            lineRef.current.material = material;
        }
    });

    const handlePointerOver = () => setHovered(true);
    const handlePointerOut = () => setHovered(false);

    return (
        <line ref={lineRef} geometry={orbitGeometry}>
            <lineBasicMaterial attach="material" color={color} />
            <primitive
                object={orbitGeometry}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            />
        </line>
    );
};

export default Orbit;
