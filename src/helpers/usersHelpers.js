exports.userResponseСonversion = userResponseСonversion = (userResponse) => ({
  user: {
    email: userResponse.email,
    subscription: userResponse.subscription,
  },
});

exports.UnauthorizedError = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 401;
  }
};
