import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Typography, Button, Avatar } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
  const { username, logout } = useContext(AuthContext);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: '#1A1A1A' }}><DirectionsCarIcon /></Avatar>
        <Box>
          <Typography variant="h4" sx={{ lineHeight: 1 }}>CAR FINDER</Typography>
          <Typography variant="caption" color="text.secondary">Logado como {username}</Typography>
        </Box>
      </Box>
      <Button variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={logout}>Sair</Button>
    </Box>
  );
}
