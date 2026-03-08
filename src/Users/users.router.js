import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deactivateUser } from './users.controller.js';
import { validateUser } from '../../middlewares/usuarios-validator.js';

const router = Router();

router.post('/create', validateUser, createUser);

router.put('/update/:id', updateUser);
router.patch('/deactivate/:id', deactivateUser);

export default router;