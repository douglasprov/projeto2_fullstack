import { useState, useContext } from 'react';
import { CarContext } from '../contexts/CarContext';
import { AuthContext } from '../contexts/AuthContext';
import {
  Card, CardContent, Box, Typography, IconButton, Chip, Divider, Avatar, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Alert, Grid,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import SensorDoorIcon from '@mui/icons-material/SensorDoor';

const CORES = {
  preto: '#1a1a1a', branco: '#f5f5f5', prata: '#c0c0c0', cinza: '#808080',
  vermelho: '#d32f2f', azul: '#1976d2', verde: '#388e3c', amarelo: '#fbc02d',
  laranja: '#f57c00', marrom: '#5d4037', bege: '#d7ccc8', vinho: '#880e4f', dourado: '#c9a227',
};
const COMBUSTIVEIS = ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'];
const CAMBIOS = ['Manual', 'Automático'];
const PORTAS = [2, 3, 4, 5];

const corHex = (n) => CORES[(n || '').toLowerCase().trim()] || '#90a4ae';
const fmtKm = (v) => (v == null || v === '' ? '—' : Number(v).toLocaleString('pt-BR') + ' km');
const fmtPreco = (v) => (v == null || v === '' ? 'Sob consulta' : 'R$ ' + Number(v).toLocaleString('pt-BR'));

export default function CarCard({ car }) {
  const { atualizarCarro, excluirCarro } = useContext(CarContext);
  const { userId } = useContext(AuthContext);
  const isOwner = car.owner === userId;

  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [f, setF] = useState({ ...car });
  const [erro, setErro] = useState('');

  const set = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  const salvar = async () => {
    setErro('');
    try {
      await atualizarCarro(car._id, {
        make: f.make, model: f.model, year: Number(f.year), color: f.color,
        fuelType: f.fuelType, transmission: f.transmission,
        doors: f.doors ? Number(f.doors) : null,
        mileage: f.mileage === '' || f.mileage == null ? null : Number(f.mileage),
        price: f.price === '' || f.price == null ? null : Number(f.price),
      });
      setEditOpen(false);
    } catch (err) { setErro(err.message); }
  };

  const excluir = async () => {
    try { await excluirCarro(car._id); setDelOpen(false); }
    catch (err) { setErro(err.message); setDelOpen(false); }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderTop: '3px solid', borderTopColor: 'primary.main' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'rgba(255,179,0,0.15)', color: 'primary.main' }}><DirectionsCarIcon /></Avatar>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.1 }}>{car.make} {car.model}</Typography>
              <Chip label={car.year} size="small" color="secondary" variant="outlined"
                sx={{ mt: 0.5, fontFamily: '"Roboto Mono", monospace' }} />
            </Box>
          </Box>
          {isOwner && (
            <Box sx={{ flexShrink: 0 }}>
              <Tooltip title="Editar"><IconButton size="small" color="primary" onClick={() => setEditOpen(true)}><EditIcon fontSize="small" /></IconButton></Tooltip>
              <Tooltip title="Excluir"><IconButton size="small" color="error" onClick={() => setDelOpen(true)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
            </Box>
          )}
        </Box>

        {car.color && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: corHex(car.color), border: '1px solid rgba(255,255,255,0.25)' }} />
            <Typography variant="body2" color="text.secondary">{car.color}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {car.fuelType && <Chip icon={<LocalGasStationIcon />} label={car.fuelType} size="small" variant="outlined" />}
          {car.transmission && <Chip icon={<SettingsIcon />} label={car.transmission} size="small" variant="outlined" />}
          {car.doors != null && <Chip icon={<SensorDoorIcon />} label={`${car.doors} portas`} size="small" variant="outlined" />}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, color: 'text.secondary' }}>
          <SpeedIcon fontSize="small" />
          <Typography sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, letterSpacing: 1 }}>{fmtKm(car.mileage)}</Typography>
        </Box>
      </CardContent>

      <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">Preço</Typography>
        <Typography sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: 'primary.main' }}>{fmtPreco(car.price)}</Typography>
      </Box>

      {erro && <Alert severity="error" sx={{ m: 1 }}>{erro}</Alert>}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar carro</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Marca" value={f.make} onChange={set('make')} fullWidth size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Modelo" value={f.model} onChange={set('model')} fullWidth size="small" /></Grid>
            <Grid size={{ xs: 6, sm: 4 }}><TextField label="Ano" value={f.year} onChange={set('year')} fullWidth size="small" /></Grid>
            <Grid size={{ xs: 6, sm: 4 }}><TextField label="Cor" value={f.color} onChange={set('color')} fullWidth size="small" /></Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField select label="Combustível" value={f.fuelType || ''} onChange={set('fuelType')} fullWidth size="small">
                <MenuItem value="">—</MenuItem>{COMBUSTIVEIS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField select label="Câmbio" value={f.transmission || ''} onChange={set('transmission')} fullWidth size="small">
                <MenuItem value="">—</MenuItem>{CAMBIOS.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField select label="Portas" value={f.doors ?? ''} onChange={set('doors')} fullWidth size="small">
                <MenuItem value="">—</MenuItem>{PORTAS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}><TextField label="Quilometragem" value={f.mileage ?? ''} onChange={set('mileage')} fullWidth size="small" /></Grid>
            <Grid size={{ xs: 6, sm: 4 }}><TextField label="Preço" value={f.price ?? ''} onChange={set('price')} fullWidth size="small" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={salvar}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent><Typography>Excluir {car.make} {car.model} ({car.year}) da garagem?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDelOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={excluir}>Excluir</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
