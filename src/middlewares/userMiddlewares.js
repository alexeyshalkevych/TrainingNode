const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/usersHelpers");
const userModel = require("../users/userModel");

const userAuthValidation = (req, res, next) => {
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

const userAuthorization = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (error) {
      next(new UnauthorizedError("Not authorized"));
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      res.status(401).send({ message: "Not authorized" });
      throw new UnauthorizedError("Not authorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

const userSubscriptionValidation = async (req, res, next) => {
  const subscriptionValidationRules = Joi.object({
    subscription: Joi.string().required(),
  });

  const subscriptionValidationResult = Joi.validate(
    req.body,
    subscriptionValidationRules
  );

  if (subscriptionValidationResult.error) {
    return res.status(400).send(subscriptionValidationResult.error);
  }

  return next();
};

module.exports = {
  userAuthValidation,
  userAuthorization,
  userSubscriptionValidation,
};
