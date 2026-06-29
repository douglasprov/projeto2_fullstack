export const AUTH_URL = 'http://localhost:4001';
export const RESOURCE_URL = 'http://localhost:4002';
export const WS_URL = 'ws://localhost:4003';

// fetch com o token JWT no header Authorization
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
