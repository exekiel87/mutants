const express = require('express');
const api = express.Router();

const mutant = require('./mutant');
const stats = require('./stats');

const routes = function (route) {
    
    api.use('/mutant', mutant);
    api.use('/stats', stats);
    
    route.use('/api', api);
}

module.exports = routes;