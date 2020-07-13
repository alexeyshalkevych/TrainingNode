const Joi = require("joi");

const userRegisterValidation = (req, res, next) => {
  const registerValidationRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const registerValidationResult = Joi.validate(
    req.body,
    registerValidationRules
  );

  if (registerValidationResult.error) {
    return res.status(400).send(registerValidationResult.error);
  }

  return next();
};

module.exports = {
  userRegisterValidation,
};
