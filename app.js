var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser');
const Boom = require('@hapi/boom');

const isReqAjaxOrApi = require('./utils/isReqAjaxOrApi');
const {wrapErrors, logErrors, clientErrorHandler, errorHandler} = require('./utils/middlewares/errorHandler');

module.exports = function run(){
  const app = express();
  const api = require('./routes/api')();
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use('/', api);
  /*
  app.use(function(req, res, next){
    next(Boom.notFound());
  });*/
  
  app.use(wrapErrors);
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);
  
  return app;
};
