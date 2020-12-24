const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");

function validationHandler(schema, check = "body") {
  return function(req, res, next) {
    //const {error} = Joi.validate(req[check], schema);
    const {error} = schema.validate(req[check]);
    error ? next(Boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;

