const fs = require('fs');
const { mercuryConstants, venusConstants, earthConstants, marsConstants, jupiterConstants, saturnConstants, uranusConstants, neptuneConstants } = require('../Constants/ShapeCoordsContants');

function CoordinateGeneratorAndSaver(generatorFunction, options, filename) {
    const coordinates = generatorFunction(options);
    const jsonData = JSON.stringify(coordinates, null, 2);
    
    fs.writeFile(`./src/Constants/${filename}`, jsonData, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log(`Successfully wrote ${filename}`);
        }
    });
}

function EllipseCoordGenerator({ steps=0.05, majorAxis, minorAxis, offsetX = 0, offsetY = 0, offsetZ = 0, tilt = 0 }) {
    const coordinates = [];
    for (let i = 0; i < 360; i += steps) {
        const radians = i * Math.PI / 180;
        const x = Math.cos(radians) * majorAxis + offsetX;
        const z = Math.sin(radians) * minorAxis + offsetZ;
        const y = Math.cos(radians) * Math.tan(tilt) *majorAxis;
        coordinates.push({ x, y, z });
    }
    return coordinates;
}

function CircularPathCoordGenerator({ steps, radius, offsetX = 0, offsetY = 0, offsetZ = 0 }) {
    const coordinates = [];
    for (let i = 0; i < 360; i += steps) {
        const radians = i * Math.PI / 180;
        const x = Math.cos(radians) * radius + offsetX;
        const y = Math.sin(radians) * radius + offsetY;
        const z = offsetZ;
        coordinates.push({ x, y, z });
    }
    return coordinates;
}

CoordinateGeneratorAndSaver(EllipseCoordGenerator, mercuryConstants, 'mercuryOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, venusConstants, 'venusOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, earthConstants, 'earthOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, marsConstants, 'marsOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, jupiterConstants, 'jupiterOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, saturnConstants, 'saturnOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, uranusConstants, 'uranusOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, neptuneConstants, 'neptuneOrbit.json');
// CoordinateGeneratorAndSaver(EllipseCoordGenerator, jupiterOrbitOptions, 'jupiterOrbit.json');
CoordinateGeneratorAndSaver(EllipseCoordGenerator, marsConstants.phobos, 'phobosOrbit.json');
const circularPathOptions = {
    steps: 1,
    radius: 50,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0
};

// CoordinateGeneratorAnd
