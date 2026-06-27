import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';
import { redis } from '../config/redis.js';
import { logger } from '../config/logger.js';

const router = Router();

// Rate limiting no login: prevenção a ataques automatizados (critério 16)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.' },
});

// POST /auth/login -> RF1
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      logger.info(`Login falhou (usuário inexistente): ${username}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      logger.info(`Login falhou (senha incorreta): ${username}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    logger.info(`Login bem-sucedido: ${username}`);
    res.json({ token, username: user.username, userId: user._id.toString() });
  } catch (err) {
    logger.error(`Erro no login: ${err.message}`);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// POST /auth/logout -> revoga o token (blocklist no Redis) (critério 16)
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token ausente.' });
    const decoded = jwt.decode(token);
    if (decoded?.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) await redis.set(`blocklist:${token}`, '1', 'EX', ttl);
    }
    logger.info(`Logout: token revogado (${decoded?.username || '?'})`);
    res.json({ message: 'Logout realizado.' });
  } catch (err) {
    logger.error(`Erro no logout: ${err.message}`);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// GET /auth/verify -> usado pelo resource-service para validar o token (critério 13)
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false, error: 'Token ausente.' });
    const revoked = await redis.get(`blocklist:${token}`);
    if (revoked) return res.status(401).json({ valid: false, error: 'Token revogado.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: { id: decoded.sub, username: decoded.username } });
  } catch {
    res.status(401).json({ valid: false, error: 'Token inválido.' });
  }
});

export default router;
