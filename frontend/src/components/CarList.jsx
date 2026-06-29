import { useState, useEffect, useContext } from 'react';
import { CarContext } from '../contexts/CarContext';
import { Box, Typography, TextField, Button, Grid, CircularProgress, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CarCard from './CarCard';

export default function CarList() {
  const { carros, loading, erro, buscarCarros } = useContext(CarContext);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => { buscarCarros(); }, [buscarCarros]);

  const handleBuscar = (e) => { e.preventDefault(); buscarCarros({ make, model, year }); };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Garagem ({carros.length})</Typography>
      <Box component="form" onSubmit={handleBuscar} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        <TextField label="Marca" size="small" value={make} onChange={(e) => setMake(e.target.value)} />
        <TextField label="Modelo" size="small" value={model} onChange={(e) => setModel(e.target.value)} />
        <TextField label="Ano" size="small" value={year} onChange={(e) => setYear(e.target.value)} sx={{ width: 110 }} />
        <Button type="submit" variant="outlined" startIcon={<SearchIcon />}>Buscar</Button>
      </Box>
      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress color="primary" /></Box>
      ) : carros.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
          <Typography>Sua garagem está vazia. Adicione um carro acima.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {carros.map((car) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={car._id}><CarCard car={car} /></Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
