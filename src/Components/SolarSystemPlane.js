import React, { useState, useRef } from 'react';
import Sun from './Sun';
import Earth from './Earth';
import CustomControls from '../Utils/CustomControls';
import Mercury from './Mercury';
import MercuryOrbit from '../Constants/mercuryOrbit.json'
import MarsOrbit from '../Constants/marsOrbit.json'
import EarthOrbit from '../Constants/earthOrbit.json'

import Orbit from './Orbit';
import Venus from './Venus';
import Mars from './Mars';
import Jupiter from './Jupiter';
import Saturn from './Saturn';
import Uranas from './Uranas';
import Neptune from './Neptune';
export default function SolarSystemPlane() {
    // const [followPlanetRef, setFollowPlanetRef] = useState(0);
    const followPlanetRef = useRef(0);
    const radiusRef = useRef(5);
    // const [selectedPlanet, setSelectedPlanet] = useState(0);
    const selectedPlanet = useRef(0);
    const sunRef = useRef(null);
    const earthRef = useRef(null);
    const mercuryRef = useRef(null);
    const venusRef = useRef(null);
    const marsRef = useRef(null);
    const jupiterRef = useRef(null);
    const saturnRef = useRef(null);
    const uranusRef = useRef(null);
    const neptuneRef = useRef(null);
    return (
        <>
            <Sun ref={sunRef} />
            <Mercury ref={mercuryRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} mercuryRef={mercuryRef}/>
           
            <Venus venusRef={venusRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet}/>
            
            <Earth earthRef={earthRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet}/>
            

            <Mars ref={marsRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} marsRef={marsRef}/>

            <Jupiter jupiterRef={jupiterRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet}/>

            <Saturn saturnRef={saturnRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet}/>

            <Uranas uranusRef={uranusRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet}/>

            <Neptune neptuneRef={neptuneRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet}/>

            <CustomControls followPlanetRef={followPlanetRef} planetRefs={[sunRef,mercuryRef, venusRef, earthRef, marsRef, jupiterRef, saturnRef, uranusRef, neptuneRef]} radiusRef={radiusRef} selectedPlanetRef={selectedPlanet}/>
            <ambientLight intensity={0.5} />
        </>
    );
}