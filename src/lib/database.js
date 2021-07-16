import mysql from 'mysql2/promise';

import { config } from './config';

let conn;

export const createConnection = async () => {
  try {
    conn = await mysql.createConnection(config.database);

    console.log('DB is connected to', config.database.host);
  } catch (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    } else {
      console.error(err.message || 'Ocurrio un error al intentar conectarnos a la BD');
    }
  }
}

export const getConnection = () => {
  if (conn) {
    return conn;
  } else {
    return false;
  }
}
