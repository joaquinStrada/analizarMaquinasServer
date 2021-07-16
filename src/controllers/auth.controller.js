import {
  schemaRegister
} from '../joi/auth.joi.js';
import { getConnection } from '../lib/database.js'
import { config } from '../lib/config.js'
import moveFile from '../lib/moveFile.js';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { fullname, email, pass } = req.body;

  /**
   * validate user
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
     * Validate user
     */
    const [ rows ] = await getConnection().query('SELECT `email` FROM `usuarios` WHERE `email`= ?', [email]);

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

    const [ results ] = await getConnection().query('INSERT INTO usuarios SET ?', [newUser]);

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
      message: err.message || 'Ocurrio un error al intertar registrar el usuario'
    });
  }
}

export const login = async (req, res) => {
  res.json('oh yeah 2!!!')
}

export const token = async (req, res) => {
  res.json('oh yeah 2!!!')
}