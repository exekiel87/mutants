const conf = require('../configs/config');

const Joi = require('joi');
const letters = conf.letters;
const createPatientSchema = 
Joi.object({
    dna:
        Joi.array().items(Joi.string().required().pattern(new RegExp(`^[${letters.join('')}]+$`))).required()
}).required();

module.exports = {
    createPatientSchema
};