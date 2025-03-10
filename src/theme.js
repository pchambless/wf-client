import { createTheme } from '@mui/material/styles';

export const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f8bbd0',
    },
    warning: {
      main: '#edc802',
    },
    background: {
      default: '#e9f3db',
      paper: '#dcfce7',
    },
    text: {
      primary: '#03061c',
      secondary: '#241ec7',
      disabled: 'rgba(92,90,90,0.54)',
      hint: '#00796b',
    },
  },
  typography: {
    h2: {
      fontSize: 40,
      fontWeight: 700,
      fontFamily: 'Raleway',
      lineHeight: 1.14,
    },
    h3: {
      fontSize: 30,
      fontWeight: 600,
    },
    fontSize: 14,
    fontWeightLight: 300,
    htmlFontSize: 16,
    h4: {
      fontSize: 25,
    },
    h5: {
      fontSize: 19,
    },
  },
  props: {
    MuiList: {
      dense: true,
    },
    MuiMenuItem: {
      dense: true,
    },
    MuiTable: {
      size: 'small',
    },
    MuiAppBar: {
      color: 'transparent',
    },
    MuiButton: {
      size: 'small',
    },
    MuiButtonGroup: {
      size: 'small',
    },
    MuiCheckbox: {
      size: 'small',
    },
    MuiFab: {
      size: 'small',
    },
    MuiFormControl: {
      margin: 'dense',
      size: 'small',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiRadio: {
      size: 'small',
    },
    MuiSwitch: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
      size: 'small',
    },
  },
  direction: 'rtl',
  spacing: 8,
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderRadius: '8px',
          '& .MuiInputBase-root': {
            height: '40px',
            padding: '10px',
          },
          '& .MuiInputBase-multiline': {
            height: 'auto',
            minHeight: '80px',
          },
          '& .MuiInputBase-root[aria-label="Description"], & .MuiInputBase-root[aria-label="Comments"]': {
            height: 'auto',
            minHeight: '80px',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            height: '40px',
            padding: '10px',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          height: '40px',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
