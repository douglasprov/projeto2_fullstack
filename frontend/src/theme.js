import { createTheme } from '@mui/material/styles';

// Tema "painel de instrumentos": grafite escuro + brilho âmbar dos mostradores + ciano digital
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#14171D', paper: '#1C2128' },
    primary: { main: '#FFB300', contrastText: '#1A1A1A' },  // âmbar (instrumentos)
    secondary: { main: '#26C6DA' },                          // ciano (display digital)
    error: { main: '#EF5350' },
    success: { main: '#66BB6A' },
    text: { primary: '#ECEFF1', secondary: '#90A4AE' },
    divider: 'rgba(255,255,255,0.08)',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h3: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: 2 },
    h4: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 700, letterSpacing: 1 },
    h5: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Rajdhani", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'radial-gradient(1200px 600px at 50% -10%, #1d222b 0%, #14171D 60%)',
          backgroundColor: '#14171D',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.06)' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});
