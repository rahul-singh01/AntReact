import { Box, Button, Divider, Typography, keyframes } from "@mui/material";
import { useState } from "react";
import InformationDisplay from "../Constants/informationDisplay.json";
import { Stepper, Step, StepLabel } from '@mui/material';
import styled from "styled-components";

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

export default function InformationPlane({ selectedPlanetState = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(null);

  const togglePanels = () => {
    setIsOpen(!isOpen);
  };

  const HoverStepLabel = styled(StepLabel)({
    '&:hover': {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      borderRadius: '4px',
    },
  });

  return (
    <>
      <Button
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: 'black',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }
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
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: 'white',
          zIndex: 1,
          animation: `${isOpen ? slideInLeft : slideOutLeft} 1s ease-out`,
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0,
          transition: 'visibility 1s, opacity 1s',
          overflowY: 'auto',
          padding: '2rem',
          marginLeft: '1rem',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.5)',
          }
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          {InformationDisplay.planets[selectedPlanetState].name}
        </Typography>
        <Divider sx={{ backgroundColor: 'white', marginBottom: '20px' }} />

        <Typography paragraph>{InformationDisplay.planets[selectedPlanetState].basic_info.description}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          Basic Information
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Radius:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.radius}
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Orbital Period:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.orbital_period}
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Rotation Period:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.rotation_period}
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Temperature:
          </Typography>
        </Typography>

        {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.average ? (
          <ul>
            <li>Average: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.average || "Not Available"}</li>
            <li>Day: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.day || "Not Available"}</li>
            <li>Night: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.night || "Not Available"}</li>
          </ul>
        ) : (
          <Typography component="span">Average: {InformationDisplay.planets[selectedPlanetState].basic_info.temperature.core}</Typography>
        )}

        {selectedPlanetState !== 0 && (
          <Typography>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              Distance from Sun:
            </Typography>
            {InformationDisplay.planets[selectedPlanetState].basic_info.distance_from_sun}
          </Typography>
        )}

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Gravity:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.gravity}
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Atmosphere:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.atmosphere}
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Surface:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.surface}
        </Typography>

        <Typography>
          <Typography component="span" sx={{ fontWeight: 'bold' }}>
            Magnetic Field:
          </Typography>
          {InformationDisplay.planets[selectedPlanetState].basic_info.magnetic_field}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          History Timeline
        </Typography>

        <Stepper orientation="vertical" nonLinear activeStep={activeStep}>
          {InformationDisplay.planets[selectedPlanetState].history_timeline.map((event, index) => (
            <Step
              key={index}
              onMouseEnter={() => {
                setActiveStep(index);
              }}
              onMouseLeave={() => setActiveStep(null)}
            >
              <StepLabel>
                <Typography sx={{
                  userSelect: 'none',
                  backgroundColor: activeStep === index ? 'rgba(69, 70, 71, 0.1)' : 'transparent',
                  color: activeStep === index ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                }}>{event}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          Moons
        </Typography>

        <ul>
          {InformationDisplay.planets[selectedPlanetState].moons.length === 0 ? (
            <li><Typography>None</Typography></li>
          ) : (
            InformationDisplay.planets[selectedPlanetState].moons.map((moon, index) => (
              <li key={index}><Typography>{moon}</Typography></li>
            ))
          )}
        </ul>

        <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
          Satellites
        </Typography>

        <ul>
          {InformationDisplay.planets[selectedPlanetState].satellites.map((satellite, index) => (
            <li key={index}><Typography>{satellite}</Typography></li>
          ))}
        </ul>
      </Box>
    </>
  );
}
