import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { join } from 'path';

import isConnected from './middelwares/isConnected.js';
import authRouter from './routes/auth.router.js';

const app = express();

// middelwares globals
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes
app.use('/api/user', isConnected, authRouter)

// static files
app.use('/public', express.static(join(__dirname, 'public')));

export default app;
