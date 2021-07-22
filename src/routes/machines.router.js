import { Router } from 'express';
import { getMachines, getCountMachines, getMachine, saveMachine, updateMachine, deleteMachine } from '../controllers/machines.controller.js';

const router = Router();

router.get('/', getMachines);

router.get('/count', getCountMachines);

router.get('/:id', getMachine);

router.post('/', saveMachine);

router.put('/:id', updateMachine);

router.delete('/:id', deleteMachine);

export default router;