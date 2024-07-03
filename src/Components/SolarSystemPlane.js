import React, { useState, useRef, useContext } from 'react';
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
import { AppContext } from '../Context/AppContext';
export default function SolarSystemPlane({ selectedPlanet, setSelectedPlanetState}) {
    // const [followPlanetRef, setFollowPlanetRef] = useState(0);
    const followPlanetRef = useRef(0);
    const radiusRef = useRef(5);
    // const [selectedPlanet, setSelectedPlanet] = useState(0);
    // const selectedPlanet = useRef(0);
    
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
            <Mercury ref={mercuryRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} mercuryRef={mercuryRef} setSelectedPlanetState= {setSelectedPlanetState}/>
           
            <Venus venusRef={venusRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} setSelectedPlanetState= {setSelectedPlanetState}/>
            
            <Earth earthRef={earthRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} setSelectedPlanetState= {setSelectedPlanetState}/>
            

            <Mars ref={marsRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} marsRef={marsRef} setSelectedPlanetState= {setSelectedPlanetState}/>

            <Jupiter jupiterRef={jupiterRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} setSelectedPlanetState= {setSelectedPlanetState}/>

            <Saturn saturnRef={saturnRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} setSelectedPlanetState= {setSelectedPlanetState}/>

            <Uranas uranusRef={uranusRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} setSelectedPlanetState= {setSelectedPlanetState}/>

            <Neptune neptuneRef={neptuneRef} followPlanetRef={followPlanetRef} radiusRef={radiusRef} selectedPlanet={selectedPlanet} setSelectedPlanetState= {setSelectedPlanetState}/>

            <CustomControls followPlanetRef={followPlanetRef} planetRefs={[sunRef,mercuryRef, venusRef, earthRef, marsRef, jupiterRef, saturnRef, uranusRef, neptuneRef]} radiusRef={radiusRef} selectedPlanetRef={selectedPlanet} setSelectedPlanetState={setSelectedPlanetState}/>
            <ambientLight intensity={0.5} />
        </>
    );
}