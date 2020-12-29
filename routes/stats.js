const express = require('express');
const Boom = require('@hapi/boom');
const {PatientsController} = require('../ControllersProvider');
module.exports = function run(){
    const router = express.Router();
    

    router.post('/api/stats', async function(req, res, next) {
        try
        {
            const data = await PatientsController.statsAction();
            
            res.status(200).send(data);
        }
        catch (err)
        {
            next(err);
        }
    });

    return router;
}