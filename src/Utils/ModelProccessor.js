import React, { forwardRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ModelProcessor = forwardRef(({ url, scale = [1, 1, 1], position = [0, 0, 0], rotation = [0, 0, 0] }, ref) => {
  const scaledScale = scale.map((s) => s * 0.01);
  const fileExtension = url.split('.').pop().toLowerCase();

  const object = useLoader(
    fileExtension === 'obj' ? OBJLoader : GLTFLoader,
    url
  );

  return (
    <primitive
      ref={ref}
      object={object.scene || object}
      scale={scaledScale}
      position={position}
      rotation={rotation}
    />
  );
});

export default ModelProcessor;
