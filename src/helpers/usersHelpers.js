exports.userResponseСonversion = userResponseСonversion = (userResponse) => ({
  user: {
    email: userResponse.email,
    subscription: userResponse.subscription,
  },
});
