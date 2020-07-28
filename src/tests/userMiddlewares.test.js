const sinon = require("sinon");
const { userAuthorization } = require("../middlewares/userMiddlewares");
const userModel = require("../users/userModel");
const jwt = require("jsonwebtoken");

describe("Unit tests for users authorization case", () => {
  describe("#userAuthorization", () => {
    let sandbox;
    let findByIdStub;
    let verifyStub;

    const req = {
      get() {},
    };

    before(async () => {
      sandbox = sinon.createSandbox();
      findByIdStub = sinon.stub(userModel, "findById");
      verifyStub = sinin.stub(jwt, "verify");

      try {
        await userAuthorization();
      } catch (error) {}
    });

    after(() => {});
  });
});
