const {
  Types: { ObjectId },
} = require("mongoose");
const Joi = require("joi");

const contactIdValidation = (req, res, next) => {
  const { contactId } = req.params;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send({ message: "This parameter does not exist" });
  }

  return next();
};

const contactCreateValidation = (req, res, next) => {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    subscription: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string(),
  });

  const validationResult = Joi.validate(req.body, validationRules);

  if (validationResult.error) {
    return res.status(404).send(validationResult.error);
  }

  return next();
};

const contactUpdateValidation = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).send({ message: "missing fields" });
  }

  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    subscription: Joi.string(),
    password: Joi.string(),
    token: Joi.string(),
  });

  const validationResult = Joi.validate(req.body, validationRules);

  if (validationResult.error) {
    return res.status(404).send(validationResult.error);
  }

  return next();
};

module.exports = {
  contactIdValidation,
  contactCreateValidation,
  contactUpdateValidation,
};
