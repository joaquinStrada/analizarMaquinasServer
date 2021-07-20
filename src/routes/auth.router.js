import { Router } from 'express';
import fileUpload from 'express-fileupload'
import { register, login, getData, editUser } from '../controllers/auth.controller.js';
import verifyToken from '../middelwares/validateToken.js';

const router = Router();

router.post('/register', fileUpload(), register);

router.post('/login', login);

router.get('/data', verifyToken, getData);

router.put('/edit', verifyToken, fileUpload(), editUser);

export default router;
