import { Box, Button, keyframes, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import InformationDisplay from "../Constants/informationDisplay.json";
import { AppContext } from "../Context/AppContext";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

export default function InformationPlane({ selectedPlanetState=0 }) {
    const [isOpen, setIsOpen] = useState(true);


    const togglePanels = () => {
        setIsOpen(!isOpen);
    };


    return (
        <>
            <Button
                sx={{
                    position: 'absolute',
                    top: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2
                }}
                onClick={togglePanels}
            >
                {isOpen ? 'Close Panels' : 'Open Panels'}
            </Button>

            <Box
                sx={{
                    position: 'absolute',
                    top: "10%",
                    left: 0,
                    height: '80%',
                    width: '30%',
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: 'white',
                    zIndex: 1,
                    animation: `${isOpen ? slideInLeft : slideOutLeft} 1s ease-out`,
                    display: isOpen ? 'block' : 'none',
                    overflowY: 'auto',
                    padding: '1rem',
                    marginLeft: '1rem',
                    //edit the scrollbar
                    '&::-webkit-scrollbar': {
                        width: '0.4em',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0,0,0,0.2)',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(0,0,0,0.5)',
                    }
                }}
            >
                <Typography variant="h4" gutterBottom>{InformationDisplay.planets[selectedPlanetState].name}</Typography>
                <Typography variant="h6">Basic Information</Typography>
                <Typography>Radius: {InformationDisplay.planets[selectedPlanetState].basic_info.radius}</Typography>
                <Typography>Orbital Period: {InformationDisplay.planets[selectedPlanetState].basic_info.orbital_period}</Typography>
                <Typography>Rotation Period: {InformationDisplay.planets[selectedPlanetState].basic_info.rotation_period}</Typography>
                <Typography>Temperature:</Typography>
                {
                    InformationDisplay.planets[selectedPlanetState].basic_info.temperature.average ?
                        <>
                            <ul>

                                <li>Average: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.average || "Not Available"}</li>
                                <li>Day: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.day || "Not Available"}</li>
                                <li>Night: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.night || "Not Available"}</li>
                            </ul>
                        </>
                        :
                        <li>Average: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.core}</li>
                }
                <Typography>Distance from Sun: {InformationDisplay.planets[selectedPlanetState].basic_info.distance_from_sun}</Typography>
                <Typography>Gravity: {InformationDisplay.planets[selectedPlanetState].basic_info.gravity}</Typography>
                <Typography>Atmosphere: {InformationDisplay.planets[selectedPlanetState].basic_info.atmosphere}</Typography>
                <Typography>Surface: {InformationDisplay.planets[selectedPlanetState].basic_info.surface}</Typography>
                <Typography>Magnetic Field: {InformationDisplay.planets[selectedPlanetState].basic_info.magnetic_field}</Typography>
                <Typography paragraph>{InformationDisplay.planets[selectedPlanetState].basic_info.description}</Typography>
                <Typography variant="h6">History Timeline</Typography>
                <ul>
                    {InformationDisplay.planets[selectedPlanetState].history_timeline.map((event, index) => (
                        <li key={index}><Typography>{event}</Typography></li>
                    ))}
                </ul>
                <Typography variant="h6">Moons</Typography>
                <ul>
                    {InformationDisplay.planets[selectedPlanetState].moons.length === 0 ? <li><Typography>None</Typography></li> : InformationDisplay.planets[selectedPlanetState].moons.map((moon, index) => (
                        <li key={index}><Typography>{moon}</Typography></li>
                    ))}
                </ul>
                <Typography variant="h6">Satellites</Typography>
                <ul>
                    {InformationDisplay.planets[selectedPlanetState].satellites.map((satellite, index) => (
                        <li key={index}><Typography>{satellite}</Typography></li>
                    ))}
                </ul>
            </Box>
        </>
    );
}
