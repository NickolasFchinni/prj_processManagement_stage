import express from 'express';
import {
  getAllProcesses,
  createProcess,
  getProcessById,
  getSubprocesses,
  getProcessTree,
  deleteProcess,
  updateProcess
} from '../controllers/ProcessController';

const router = express.Router();

router.get('/', getAllProcesses);

router.post('/', createProcess);

router.get('/:id', (req, res) => {
  getProcessById(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

router.get('/:id/subprocesses', getSubprocesses);

router.put('/:id', (req, res) => {
  updateProcess(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

router.delete('/:id', (req, res) => {
  deleteProcess(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

router.get('/:id', (req, res) => {
  getProcessTree(req, res).then((result) => {
    if (result) res.send(result);
  }).catch(err => res.status(500).send(err));
});

export default router;