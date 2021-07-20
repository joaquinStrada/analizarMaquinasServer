import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

export default execPromise;