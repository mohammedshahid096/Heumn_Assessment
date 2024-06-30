const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// register validation schema
module.exports.RegisterUserValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required().label("full name"),
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
  });

  return schema.validate(body);
};

// login validation schema
module.exports.LoginUserValidation = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
  });

  return schema.validate(body);
};
