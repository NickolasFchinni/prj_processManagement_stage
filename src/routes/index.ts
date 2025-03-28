import express from 'express';
import areaRoutes from './areas';
import processRoutes from './processes';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Mapeamento de processos');
});

router.use('/api/areas', areaRoutes);

router.use('/api/processes', processRoutes);

export default router;