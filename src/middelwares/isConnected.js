import { getConnection } from '../lib/database';

const isConnected = (req, res, next) => {
  if (!getConnection()) {
    return res.status(500).json({
      error: true,
      message: 'DB is not connected'
    });
  } else {
    next();
  }
}

export default isConnected;
