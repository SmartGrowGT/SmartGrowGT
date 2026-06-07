import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deactivateUser, activateUser } from './users.controller.js';
import { validateUser } from '../../middlewares/usuarios-validator.js';

const router = Router();

router.get('/test-ruta', (req, res) => {
    res.status(200).json({ message: "¡La ruta de usuarios funciona!" });
});

router.post('/create', validateUser, createUser);
router.put('/update/:id', updateUser);
router.put('/deactivate/:id', deactivateUser);

router.get('/:id', getUserById); 

export default router;