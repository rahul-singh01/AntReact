import logo from './logo.svg';
import './App.css';
import { Box, ThemeProvider } from '@mui/material';
import theme from './Themes/Theme';
import { Canvas } from '@react-three/fiber';
import SolarSystemPlane from './Components/SolarSystemPlane';
function App() {
  return (
    <ThemeProvider theme={theme}>
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
          <SolarSystemPlane />
        </Canvas>
      </Box>

    </ThemeProvider>
  );
}

export default App;
