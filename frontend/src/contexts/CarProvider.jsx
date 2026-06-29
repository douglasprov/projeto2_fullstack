import { useState, useEffect, useCallback, useContext } from 'react';
import { CarContext } from './CarContext';
import { AuthContext } from './AuthContext';
import { apiFetch, RESOURCE_URL, WS_URL } from '../api';

export function CarProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Busca/lista carros (RF2)
  const buscarCarros = useCallback(async (filtros = {}) => {
    setErro('');
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.make) params.append('make', filtros.make);
      if (filtros.model) params.append('model', filtros.model);
      if (filtros.year) params.append('year', filtros.year);
      const res = await apiFetch(`${RESOURCE_URL}/cars?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Erro ao buscar.');
        setCarros([]);
        return;
      }
      setCarros(data);
    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  const criarCarro = async (dados) => {
    const res = await apiFetch(`${RESOURCE_URL}/cars`, { method: 'POST', body: JSON.stringify(dados) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar.');
    return data;
  };

  const atualizarCarro = async (id, dados) => {
    const res = await apiFetch(`${RESOURCE_URL}/cars/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao atualizar.');
    return data;
  };

  const excluirCarro = async (id) => {
    const res = await apiFetch(`${RESOURCE_URL}/cars/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao excluir.');
    return data;
  };

  // WebSocket (RF6): ao receber evento, recarrega a lista automaticamente (sem reload)
  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket(WS_URL);
    ws.onmessage = () => buscarCarros();
    return () => ws.close();
  }, [token, buscarCarros]);

  return (
    <CarContext.Provider value={{ carros, loading, erro, buscarCarros, criarCarro, atualizarCarro, excluirCarro }}>
      {children}
    </CarContext.Provider>
  );
}
