const Joi = require('joi');
const letters = ['A','C','T','G'];
const createPatientSchema = 
Joi.object({
    dna:
        Joi.array().items(Joi.string().required().pattern(new RegExp(`^[${letters.join('')}]+$`))).required()
}).required();

module.exports = {
    createPatientSchema
};