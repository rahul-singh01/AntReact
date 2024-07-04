import logo from './logo.svg';
import './App.css';
import { Box, ThemeProvider } from '@mui/material';
import theme from './Themes/Theme';
import { Canvas } from '@react-three/fiber';
import SolarSystemPlane from './Components/SolarSystemPlane';
import InformationPlane from './Components/InformationPlane';
import { useRef, useState } from 'react';
function App() {
  const selectedPlanet = useRef(0);
  const [selectedPlanetState, setSelectedPlanetState] = useState(0);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: "black",
        position: 'relative',
        zIndex: 0,
      }}>
        <InformationPlane selectedPlanetState={selectedPlanetState}/>
        <Box
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: "black",
            position: 'relative',
            zIndex: 0,
          })}
        >
          <Canvas style={{
            width: '100vw',
            height: '100vh',
            display: 'block',
            margin: 0,
            padding: 0,
            // backgroundColor: 'black',
            position: 'absolute',
          }}>
            <SolarSystemPlane selectedPlanetState={selectedPlanetState} selectedPlanet={selectedPlanet} setSelectedPlanetState={setSelectedPlanetState}/>
          </Canvas>
        </Box>
      </Box>

    </ThemeProvider>
  );
}

export default App;
