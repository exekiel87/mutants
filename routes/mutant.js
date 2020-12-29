const express = require('express');
const Boom = require('@hapi/boom');

const validation = require('../utils/middlewares/validationHandler');
const {createPatientSchema} = require('../schemas/patient');
const {PatientsController} = require('../ControllersProvider');

module.exports = function run(){

    const router = express.Router();

    router.post('/api/mutant',
        validation(createPatientSchema),
        async function({body}, res, next) {
            try
            {
                const {dna} = body;

                const isMutant = await PatientsController.isMutantAction(dna);
                
                if(!isMutant){
                    return next(Boom.forbidden());                    
                }else{
                    res.status(200).send();
                }
            }
            catch (err)
            {
                next(err);
            }
        }
    );

    return router;
}