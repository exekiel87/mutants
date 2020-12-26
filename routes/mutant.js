const express = require('express');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const router = express.Router();

/*
const validation = require('../utils/middlewares/validationHandler');
const {createEventSchema} = require('../schemas/event');*/
const {PatientsController} = require('../ControllersProvider');

router.post('/', async function({body}, res, next) {
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
});

module.exports = router;