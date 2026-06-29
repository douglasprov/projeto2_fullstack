import { useState, useContext } from 'react';
import { CarContext } from '../contexts/CarContext';
import { Paper, Typography, TextField, Button, Box, Alert, Grid, MenuItem, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const COMBUSTIVEIS = ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'];
const CAMBIOS = ['Manual', 'Automático'];
const PORTAS = [2, 3, 4, 5];
const vazio = { make: '', model: '', year: '', color: '', fuelType: '', transmission: '', doors: '', mileage: '', price: '' };

export default function CarForm() {
  const { criarCarro } = useContext(CarContext);
  const [f, setF] = useState(vazio);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState('');

  const set = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); setOk('');
    if (!f.make.trim() || !f.model.trim() || !String(f.year).trim()) {
      setErro('Marca, modelo e ano são obrigatórios.');
      return;
    }
    try {
      await criarCarro({
        ...f,
        year: Number(f.year),
        doors: f.doors ? Number(f.doors) : null,
        mileage: f.mileage === '' ? null : Number(f.mileage),
        price: f.price === '' ? null : Number(f.price),
      });
      setF(vazio);
      setOk('Carro adicionado à garagem!');
    } catch (err) { setErro(err.message); }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderLeft: '3px solid', borderLeftColor: 'primary.main' }}>
      <Typography variant="h5" gutterBottom>Adicionar carro</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}><TextField label="Marca *" value={f.make} onChange={set('make')} fullWidth size="small" /></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField label="Modelo *" value={f.model} onChange={set('model')} fullWidth size="small" /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}><TextField label="Ano *" value={f.year} onChange={set('year')} fullWidth size="small" /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}><TextField label="Cor" value={f.color} onChange={set('color')} fullWidth size="small" /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField select label="Combustível" value={f.fuelType} onChange={set('fuelType')} fullWidth size="small">
              <MenuItem value="">—</MenuItem>
              {COMBUSTIVEIS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField select label="Câmbio" value={f.transmission} onChange={set('transmission')} fullWidth size="small">
              <MenuItem value="">—</MenuItem>
              {CAMBIOS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField select label="Portas" value={f.doors} onChange={set('doors')} fullWidth size="small">
              <MenuItem value="">—</MenuItem>
              {PORTAS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField label="Quilometragem" value={f.mileage} onChange={set('mileage')} fullWidth size="small"
              InputProps={{ endAdornment: <InputAdornment position="end">km</InputAdornment> }} />
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }}>
            <TextField label="Preço" value={f.price} onChange={set('price')} fullWidth size="small"
              InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="contained" startIcon={<AddIcon />} fullWidth sx={{ height: 40 }}>Adicionar</Button>
          </Grid>
        </Grid>
      </Box>
      {erro && <Alert severity="error" sx={{ mt: 2 }}>{erro}</Alert>}
      {ok && <Alert severity="success" sx={{ mt: 2 }}>{ok}</Alert>}
    </Paper>
  );
}
