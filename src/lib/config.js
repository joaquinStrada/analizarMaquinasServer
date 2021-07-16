import { config as dotenv } from 'dotenv';
dotenv();

export const config = {
  express: {
    port: process.env.PORT || 3000
  },
  database: {
    host: process.env.HOST_DB || 'localhost',
    port: process.env.PORT_DB || 3306,
    user: process.env.USER_DB || 'root',
    password: process.env.PASS_DB || '',
    database: process.env.DB_NAME || 'maquinas'
  },
  profile: {
    imageUrlBase: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/public/profile/`,
    imageUrlDefault: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/public/profile/withoutPicture.png`
  },
  jwt: {
    tokenSecret: process.env.TOKEN_SECRET
  }
}
