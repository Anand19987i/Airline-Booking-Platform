import { Router } from 'express';
import { login, userRegister } from '../controllers/user.controller.js';


const router = Router();

router.post('/signup', userRegister);
router.post('/login', login);

export default router;