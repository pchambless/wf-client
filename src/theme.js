import { createTheme, ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
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
};

const theme = createTheme(themeOptions);

export default theme;
