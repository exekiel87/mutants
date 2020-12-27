const express = require('express');
const Boom = require('@hapi/boom');

const validation = require('../utils/middlewares/validationHandler');
const {createPatientSchema} = require('../schemas/patient');
const {PatientsController} = require('../ControllersProvider');

const router = express.Router();

router.post('/',
    validation(createPatientSchema),
    async function({body}, res, next) {
        try
        {
            const {dna} = body;

            const isMutant = await PatientsController.isMutantAction(dna);
            
            if(!isMutant){
                next(Boom.forbidden());
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

module.exports = router;