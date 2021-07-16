import {
  schemaRegister,
  schemaLogin
} from '../joi/auth.joi.js';
import { getConnection } from '../lib/database.js'
import { config } from '../lib/config.js'
import moveFile from '../lib/moveFile.js';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { fullname, email, pass } = req.body;

  /**
   * validate user inputs
   */
  const { error } = schemaRegister.validate({
    fullname,
    email,
    pass
  })

  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message
    });
  }

  try {
    /**
     * Validate is not exist email on DB
     */
    const [rows] = await getConnection().query('SELECT `email` FROM `usuarios` WHERE `email`= ?', [email]);

    if (rows.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'El email ya existe en la bd'
      })
    }

    /**
     * Upload the image
     */
    const files = req.files;
    let imageUrl = '';

    if (files) {
      const file = files.file;
      const { mimetype, name } = file;
      const type = mimetype.split('/')[0];

      if (type !== 'image') {
        return res.status(400).json({
          error: true,
          message: 'El archivo debe ser una imagen'
        })
      }

      const arrayName = name.split('.');
      const finallyName = `${uuid()}.${arrayName[arrayName.length - 1]}`;

      const pathImage = join(__dirname, '..', 'public', 'profile', finallyName)
      moveFile(file, pathImage);

      imageUrl = config.profile.imageUrlBase + finallyName;
    } else {
      imageUrl = config.profile.imageUrlDefault;
    }

    /**
     * Generate pass encrypt
     */
    const salt = await bcrypt.genSalt(10);
    const passEncrypt = await bcrypt.hash(pass, salt);

    /**
     * Save into table
     */
    const newUser = {
      nombre: fullname,
      email,
      password: passEncrypt,
      'imagen_url': imageUrl
    };

    const [results] = await getConnection().query('INSERT INTO usuarios SET ?', [newUser]);

    /**
     * Return the user
     */
    const newRowDB = await getConnection().query('SELECT * FROM `usuarios` WHERE `id` = ?', [results.insertId]);
    const newRow = newRowDB[0][0];

    res.json({
      error: false,
      data: newRow
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: err.message || 'Ocurrio un error al intentar registrar el usuario'
    });
  }
}

export const login = async (req, res) => {
  const { email, pass } = req.body;

  /**
   * validate user inputs
   */
  const { error } = schemaLogin.validate({
    email,
    pass
  });

  if (error) {
    return res.status(400).json({
      error: true,
      message: error.details[0].message
    });
  }

  try {
    /**
     * validate email
     */
    const [rows] = await getConnection().query('SELECT * FROM `usuarios` WHERE `email` = ?', [email]);

    if (rows.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Usuario y/o contraseña incorrectos'
      });
    }

    const userDB = rows[0];

    /**
     * validate password
     */
    const validPassword = await bcrypt.compare(pass, userDB.password);

    if (!validPassword) {
      return res.status(400).json({
        error: true,
        message: 'Usuario y/o contraseña incorrectos'
      });
    }

    /**
     * Create token
     */
    const token = jwt.sign({
      id: userDB.id,
      fechayhora: userDB.fechayhora,
      nombre: userDB.nombre,
      email: userDB.email,
      imageUrl: userDB['imagen_url']
    }, config.jwt.tokenSecret);

    res.header('auth-token', token).json({
      error: false,
      data: {
        token
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: true,
      message: err.message || 'Ocurrio un error al intentar hacer login con el usuario'
    })
  }
}

export const getData = (req, res) => {
  const data = req.user;

  res.json({
    error: false,
    data
  });
}
