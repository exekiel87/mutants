const conf = require('../configs/config');

const Joi = require('joi');
const letters = conf.letters;
const createPatientSchema = 
Joi.object({
    dna:
        Joi.array()
        .items(
            Joi.string()
            .required()
            .pattern(new RegExp(`^[${letters.join('')}]+$`))
        )
        .required()
        .custom(nxnTable,'nxn table validation')
}).required();

function nxnTable(value, helpers){
    const message = 'it\'s not a nxn table';
    const {original: dna} = helpers;    
    const length = dna[0].length;
    const dnaLength = dna.length;

    if(dnaLength !== length){
        throw new Error(message);
    }

    for(secuence of dna){
        if(secuence.length !== length){
            throw new Error(message);
        }
    }

    return value;
}

module.exports = {
    createPatientSchema
};