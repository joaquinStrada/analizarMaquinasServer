import { Router } from 'express';
import fileUpload from 'express-fileupload'
import { register, login, getData } from '../controllers/auth.controller.js';
import verifyToken from '../middelwares/validateToken.js';

const router = Router();

router.post('/register', fileUpload(), register);

router.post('/login', login);

router.get('/data', verifyToken, getData);

export default router;
