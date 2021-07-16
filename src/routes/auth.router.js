import { Router } from 'express';
import fileUpload from 'express-fileupload'
import { register, login, token } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', fileUpload(), register);

router.post('/login', login);

router.get('/token', token);

export default router;
