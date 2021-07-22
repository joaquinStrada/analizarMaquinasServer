import { schemaSave } from '../joi/machines.joi.js';
import { getConnection } from '../lib/database.js';

export const getMachines = async (req, res) => {
    res.json('oh yeah!!!');
}

export const getCountMachines = async (req, res) => {
    res.json('oh yeah!!!');
}

export const getMachine = async (req, res) => {
    res.json('oh yeah!!!');
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
        const [ isExistName ] = await getConnection().query('SELECT * FROM `maquinas` WHERE `nombre` = ? AND `usuario_id` = ?', [name, id]);
        
        if (isExistName.length  > 0) {
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

        const [ results ] = await getConnection().query('INSERT INTO maquinas SET ?', saveMachine);

        /**
         * Response the user
         */
        const [ rows ] = await getConnection().query('SELECT * FROM `maquinas` WHERE `id` = ?', [results.insertId]);
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
    res.json('oh yeah!!!');
}

export const deleteMachine = async (req, res) => {
    res.json('oh yeah!!!');
}