const express = require('express');

module.exports = function () {

    const api = express.Router();

    const mutant = require('./mutant')();
    const stats = require('./stats')();
    
    api.use('/', mutant);
    api.use('/', stats);
    
    return api;
}