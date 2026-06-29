import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { AUTH_URL } from '../api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [erro, setErro] = useState('');

  const login = async (user, senha) => {
    setErro('');
    try {
      const res = await fetch(`${AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || 'Erro ao entrar.');
        return false;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userId', data.userId);
      setToken(data.token);
      setUsername(data.username);
      setUserId(data.userId);
      return true;
    } catch {
      setErro('Não foi possível conectar ao servidor.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${AUTH_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignora erro de rede no logout */ }
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setToken('');
    setUsername('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ token, username, userId, erro, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
