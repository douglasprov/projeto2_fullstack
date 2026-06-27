import { Router } from 'express';
import { Car } from '../models/Car.js';
import { autenticar } from '../config/auth.js';
import { redis } from '../config/redis.js';
import { limparTexto } from '../config/sanitize.js';
import { logger } from '../config/logger.js';

const router = Router();
const CACHE_TTL = Number(process.env.CACHE_TTL || 30);

async function publicarEvento(tipo, car) {
  await redis.publish('car-events', JSON.stringify({ type: tipo, car }));
}

async function invalidarCache() {
  const keys = await redis.keys('cars:*');
  if (keys.length) await redis.del(keys);
}

// Valida os campos; devolve mensagem de erro ou null
function validar(b) {
  if (!b.make || !b.model || b.year === undefined || b.year === '') {
    return 'Marca, modelo e ano são obrigatórios.';
  }
  const ano = Number(b.year);
  if (isNaN(ano) || ano < 1900 || ano > 2100) return 'Ano inválido (1900–2100).';
  const numOk = (v) => v === '' || v == null || (!isNaN(Number(v)) && Number(v) >= 0);
  if (!numOk(b.mileage)) return 'Quilometragem inválida.';
  if (!numOk(b.price)) return 'Preço inválido.';
  return null;
}

// Monta e sanitiza os dados do carro
function montarDados(b, owner) {
  const dados = {
    make: limparTexto(b.make),
    model: limparTexto(b.model),
    year: Number(b.year),
    color: limparTexto(b.color || ''),
    fuelType: limparTexto(b.fuelType || ''),
    transmission: limparTexto(b.transmission || ''),
    doors: b.doors ? Number(b.doors) : null,
    mileage: (b.mileage === '' || b.mileage == null) ? null : Number(b.mileage),
    price: (b.price === '' || b.price == null) ? null : Number(b.price),
  };
  if (owner) dados.owner = owner;
  return dados;
}

router.use(autenticar); // RF2 a RF5 exigem autenticação

// GET /cars -> Busca (RF2) com cache (critério 21)
router.get('/', async (req, res) => {
  try {
    const { make, model, year } = req.query;
    if (year && isNaN(Number(year))) return res.status(400).json({ error: 'O ano deve ser um número.' });

    const filtro = {};
    if (make) filtro.make = new RegExp(limparTexto(make), 'i');
    if (model) filtro.model = new RegExp(limparTexto(model), 'i');
    if (year) filtro.year = Number(year);

    const cacheKey = `cars:${JSON.stringify(filtro)}`;
    const hit = await redis.get(cacheKey);
    if (hit) { logger.info('Busca (cache hit)'); return res.json(JSON.parse(hit)); }

    const cars = await Car.find(filtro).sort({ createdAt: -1 });
    await redis.set(cacheKey, JSON.stringify(cars), 'EX', CACHE_TTL);
    logger.info(`Busca: ${cars.length} registros (user ${req.user.username})`);
    res.json(cars);
  } catch (err) {
    logger.error(`Erro na busca: ${err.message}`);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// POST /cars -> Inserção (RF3), vincula ao dono
router.post('/', async (req, res) => {
  try {
    const erro = validar(req.body);
    if (erro) return res.status(400).json({ error: erro });
    const car = await Car.create(montarDados(req.body, req.user.id));
    await invalidarCache();
    await publicarEvento('recurso.criado', car);
    logger.info(`Inserção: ${car.make} ${car.model} por ${req.user.username}`);
    res.status(201).json(car);
  } catch (err) {
    logger.error(`Erro na inserção: ${err.message}`);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// PUT /cars/:id -> Atualização (RF4), só o dono (403)
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Registro não encontrado.' });
    if (car.owner !== req.user.id) {
      logger.info(`403: ${req.user.username} tentou editar registro alheio`);
      return res.status(403).json({ error: 'Você só pode editar seus próprios registros.' });
    }
    const erro = validar(req.body);
    if (erro) return res.status(400).json({ error: erro });
    Object.assign(car, montarDados(req.body));
    await car.save();
    await invalidarCache();
    await publicarEvento('recurso.atualizado', car);
    logger.info(`Atualização: ${car._id} por ${req.user.username}`);
    res.json(car);
  } catch (err) {
    logger.error(`Erro na atualização: ${err.message}`);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// DELETE /cars/:id -> Exclusão (RF5), só o dono (403)
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Registro não encontrado.' });
    if (car.owner !== req.user.id) {
      logger.info(`403: ${req.user.username} tentou excluir registro alheio`);
      return res.status(403).json({ error: 'Você só pode excluir seus próprios registros.' });
    }
    await car.deleteOne();
    await invalidarCache();
    await publicarEvento('recurso.excluido', car);
    logger.info(`Exclusão: ${car._id} por ${req.user.username}`);
    res.json({ message: 'Registro excluído.', id: car._id });
  } catch (err) {
    logger.error(`Erro na exclusão: ${err.message}`);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

export default router;
