import express from 'express';
import {
  getAllAreas,
  createArea,
  deleteArea,
  getAreaById,
  getAreaProcesses
} from '../controllers/AreaController';

const router = express.Router();

// GET /api/areas
router.get('/', getAllAreas);

// POST /api/areas
router.post('/', createArea);

router.delete('/:id', (req, res) => {
  deleteArea(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

router.get('/:id', (req, res) => {
  getAreaById(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

router.get('/:id/areaProcesses', (req, res) => {
  getAreaProcesses(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

export default router;