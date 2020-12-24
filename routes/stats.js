const express = require('express');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const router = express.Router();
//toDo: validaciones
/*
const validation = require('../utils/middlewares/validationHandler');
const {createEventSchema} = require('../schemas/event');*/
const {PatientsController} = require('../dbControllers');

router.post('/', async function(req, res, next) {
    try
    {
        const data = await PatientsController.statsAction(); //toDo: agregar await       
        
        res.status(200).send({ok:true, ...data}); //toDo: centralizar decoracion response
    }
    catch (err)
    {
        next(err);
    }
});

module.exports = router;