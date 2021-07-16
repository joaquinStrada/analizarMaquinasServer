import jwt from 'jsonwebtoken';
import { config } from '../lib/config.js';
import { getConnection } from '../lib/database';

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Acceso Denegado'
        });
    }

    try {
        const verified = jwt.verify(token, config.jwt.tokenSecret);

        req.user = verified;
        next();
    } catch (err) {
        return res.status(401).json({
            error: true,
            message: 'Acceso Denegado'
        }); 
    }
}

export default verifyToken;