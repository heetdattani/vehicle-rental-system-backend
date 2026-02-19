const Joi = require("joi");

exports.vehicleSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  rentPerDay: Joi.number().min(1).required(),
  description: Joi.string().allow(""),
  image: Joi.string().allow(""),
  popularity: Joi.number().min(0),
});
