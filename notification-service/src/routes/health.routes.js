import { Router } from 'express';
const router = Router();
router.get('/', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
export default router;