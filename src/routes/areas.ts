import express from 'express';
import {
  getAllAreas,
  createArea,
  deleteArea,
  getAreaById,
  updateArea,
  getAreaProcesses
} from '../controllers/AreaController';

const router = express.Router();

router.get('/', getAllAreas);

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

router.put('/:id', updateArea)

export default router;