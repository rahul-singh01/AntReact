import { createTheme } from '@mui/material/styles';

// Define the color palette with meaningful names and different shades
const colorPalette = {
  ocean: {
    light: '#a7c7e7',
    main: '#2196f3',
    dark: '#0b79d0',
    contrastText: '#ffffff',
  },
  sunset: {
    light: '#ffad85',
    main: '#ff5722',
    dark: '#d84315',
    contrastText: '#ffffff',
  },
  forest: {
    light: '#a5d6a7',
    main: '#4caf50',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  sunshine: {
    light: '#fff59d',
    main: '#ffeb3b',
    dark: '#fbc02d',
    contrastText: '#000000',
  },
  lavender: {
    light: '#e1bee7',
    main: '#9c27b0',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  rose: {
    light: '#f48fb1',
    main: '#e91e63',
    dark: '#c2185b',
    contrastText: '#ffffff',
  },
  sky: {
    light: '#81d4fa',
    main: '#03a9f4',
    dark: '#0288d1',
    contrastText: '#ffffff',
  },
  lime: {
    light: '#dcedc8',
    main: '#cddc39',
    dark: '#afb42b',
    contrastText: '#000000',
  },
  grape: {
    light: '#d1c4e9',
    main: '#673ab7',
    dark: '#512da8',
    contrastText: '#ffffff',
  },
  ember: {
    light: '#ffccbc',
    main: '#ff7043',
    dark: '#d84315',
    contrastText: '#000000',
  },
};

// Create the theme
const theme = createTheme({
  palette: {
    ocean: colorPalette.ocean,
    sunset: colorPalette.sunset,
    forest: colorPalette.forest,
    sunshine: colorPalette.sunshine,
    lavender: colorPalette.lavender,
    rose: colorPalette.rose,
    sky: colorPalette.sky,
    lime: colorPalette.lime,
    grape: colorPalette.grape,
    ember: colorPalette.ember,

    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
      hint: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
