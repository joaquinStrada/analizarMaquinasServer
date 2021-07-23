import { schemaSave } from '../joi/machines.joi.js';
import { getConnection } from '../lib/database.js';

export const getMachines = async (req, res) => {
    const { id } = req.user;

    try {
        const [rows] = await getConnection().query('SELECT * FROM `maquinas` WHERE `usuario_id` = ?', [id]);

        res.json({
            error: false,
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message || 'Ocurrio un error al intentar obtener las maquinas'
        });
    }
}

export const getCountMachines = async (req, res) => {
    const { id } = req.user;

    try {
        const [rows] = await getConnection().query('SELECT COUNT(*) FROM `maquinas` WHERE `usuario_id` = ?', [id]);

        res.json({
            error: false,
            data: rows[0]["COUNT(*)"]
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message || 'Ocurrio un error al intentar obtener la cantidad de maquinas'
        });
    }
}

export const getMachine = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const [rows] = await getConnection().query('SELECT * FROM `maquinas` WHERE `id` = ?', [id]);

        /**
         * Validate the row
         */
        if (rows.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'El id de la maquina no existe en la base de datos'
            });
        } else if (rows[0]["usuario_id"] !== userId) {
            return res.status(400).json({
                error: true,
                message: 'Usted no tiene acceso a visualizar esta maquina'
            });
        }

        res.json({
            error: false,
            data: rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message || 'Ocurrio un error al intentar obtener la maquina'
        });
    }
}

export const saveMachine = async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.user;

    /**
     * Validate inputs
     */
    const { error } = schemaSave.validate({
        name,
        description,
        id
    });

    if (error) {
        return res.status(400).json({
            error: true,
            message: error.details[0].message
        });
    }

    try {
        /**
         * Valid name machine is not exist
         */
        const [isExistName] = await getConnection().query('SELECT * FROM `maquinas` WHERE `nombre` = ? AND `usuario_id` = ?', [name, id]);

        if (isExistName.length > 0) {
            return res.status(400).json({
                error: true,
                message: 'Ya tienes una maquina con ese nombre'
            });
        }

        /**
         * Save Machine
         */
        const saveMachine = {
            nombre: name,
            descripcion: description,
            'usuario_id': id
        };

        const [results] = await getConnection().query('INSERT INTO maquinas SET ?', saveMachine);

        /**
         * Response the user
         */
        const [rows] = await getConnection().query('SELECT * FROM `maquinas` WHERE `id` = ?', [results.insertId]);
        const saveMachineDB = rows[0];

        res.json({
            error: false,
            data: saveMachineDB
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message || 'Ocurrio un error al intentar registrar la maquina'
        });
    }
}

export const updateMachine = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
}

export const deleteMachine = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        /**
         * Validate machine id
         */
        const [rows] = await getConnection().query('SELECT * FROM `maquinas` WHERE `id` = ?', [id]);

        if (rows.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'El id de la maquina no existe en la base de datos'
            });
        } else if (rows[0]["usuario_id"] !== userId) {
            return res.status(400).json({
                error: true,
                message: 'Usted no tiene acceso a eliminar esta maquina'
            });
        }

        /**
         * Delete the machine
         */
        await getConnection().query('DELETE FROM maquinas WHERE `id` = ?', [id]);

        res.json({
            error: false,
            data: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message || 'Ocurrio un error al intentar eliminar la maquina'
        });
    }
}