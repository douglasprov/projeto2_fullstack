import { useContext } from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthProvider';
import { AuthContext } from './contexts/AuthContext';
import { CarProvider } from './contexts/CarProvider';
import Login from './components/Login';
import Header from './components/Header';
import CarForm from './components/CarForm';
import CarList from './components/CarList';

function Conteudo() {
  const { token } = useContext(AuthContext);
  if (!token) return <Login />;
  return (
    <CarProvider>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Header />
        <CarForm />
        <CarList />
      </Container>
    </CarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Conteudo />
      </AuthProvider>
    </ThemeProvider>
  );
}
