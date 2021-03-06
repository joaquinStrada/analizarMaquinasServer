import JOI from '@hapi/joi';

export const schemaSave = JOI.object({
    name: JOI.string().min(6).max(40).required(),
    description: JOI.string().min(6).max(400).required(),
    id: JOI.number().integer().min(1).max(9999999999).required()
});

export const schemaUpdate = JOI.object({
    id: JOI.number().integer().min(1).max(9999999999).required(),
    name: JOI.string().min(6).max(40).required(),
    description: JOI.string().min(6).max(400).required(),
    userId: JOI.number().integer().min(1).max(9999999999).required()
});