import { logger } from './logger.js';

// Middleware: valida o token CONSULTANDO o auth-service via HTTP (critério 13)
export async function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token ausente.' });

    const resp = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/verify`, {
      headers: { Authorization: authHeader },
    });

    if (!resp.ok) return res.status(401).json({ error: 'Não autorizado.' });

    const data = await resp.json();
    req.user = data.user; // { id, username }
    next();
  } catch (err) {
    logger.error(`Falha ao consultar auth-service: ${err.message}`);
    res.status(503).json({ error: 'Serviço de autenticação indisponível.' });
  }
}
