const express = require('express');

const router = express.Router();
const {PatientsController} = require('../ControllersProvider');

router.post('/', async function(req, res, next) {
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

module.exports = router;