import app from './app.js';
import { config } from './lib/config.js'
import { createConnection } from './lib/database.js';

createConnection();

app.listen(config.express.port, () => console.log('Server on port:', config.express.port));
