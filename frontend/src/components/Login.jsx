import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function Login() {
  const { login, erro } = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    await login(user, senha);
    setCarregando(false);
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', borderTop: '3px solid', borderTopColor: 'primary.main' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <DirectionsCarIcon sx={{ fontSize: 52, color: 'primary.main' }} />
          <Typography variant="h3" sx={{ mt: 1 }}>CAR FINDER</Typography>
          <Typography variant="body2" color="text.secondary">Entre na sua garagem</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Usuário" value={user} onChange={(e) => setUser(e.target.value)} fullWidth />
          <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} fullWidth />
          {erro && <Alert severity="error">{erro}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={carregando} fullWidth>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Button>
        </Box>
        <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 2 }}>
          Teste: douglas / senha123
        </Typography>
      </Paper>
    </Container>
  );
}
