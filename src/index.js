import app from './app.js';
import { config } from './lib/config.js'

app.listen(config.express.port, () => console.log('Server on port:', config.express.port));
