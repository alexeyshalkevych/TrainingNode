const sinon = require("sinon");
const { userAuthorization } = require("../middlewares/userMiddlewares");
const userModel = require("../users/userModel");
const jwt = require("jsonwebtoken");
const should = require("should");
const { UnauthorizedError } = require("../helpers/usersHelpers");
const { assert } = require("joi");

describe("Unit tests for users authorization case", () => {
  describe("#userAuthorization", () => {
    let sandbox;
    let findByIdStub;
    let verifyStub;
    let result;

    const user = {
      _id: {
        $oid: "5f1f31dd172af82b8cf91182",
      },
      subscription: "free",
      email: "alex.code@gmail.com",
      avatarURL:
        "http://localhost:4242/images/bbdc8289-93c7-43e1-a997-5a9144fa85d7.png",
      __v: 0,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMWYzMWRkMTcyYWY4MmI4Y2Y5MTE4MiIsImlhdCI6MTU5NTkzODY5MCwiZXhwIjoxNTk2MDI1MDkwfQ._M6NN5tHBuhVsovFIEmkZBrU-6FaQR7EG0jGZd7P_GE",
    };

    let req, res, next;

    let userId;
    let token;

    before(async () => {
      process.env.SILENT = false;
      sandbox = sinon.createSandbox();
      findByIdStub = sinon
        .stub(userModel, "findById")
        .callsFake((id) => (user._id.$oid === id ? user : null));
      verifyStub = sinon.stub(jwt, "verify");
      next = sinon.spy();

      req = {
        get(header) {
          return `Bearer ${token}`;
        },
      };

      try {
        await userAuthorization(req, res, next);
      } catch (error) {
        result = error;
      }
    });

    after(() => {
      sandbox.restore();
      process.env.SILENT = true;
    });

    it("should call verify if token valid", () => {
      token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMWYzMWRkMTcyYWY4MmI4Y2Y5MTE4MiIsImlhdCI6MTU5NTkzODY5MCwiZXhwIjoxNTk2MDI1MDkwfQ._M6NN5tHBuhVsovFIEmkZBrU-6FaQR7EG0jGZd7P_GE";

      verifyStub.withArgs(token, process.env.JWT_SECRET);
      sinon.assert.calledOnce(verifyStub);

      should.equal(user.token, token);
    });

    it("should call verify if token invalid", () => {
      token = "not_valid_token";
      verifyStub.withArgs(token, process.env.JWT_SECRET);
      sinon.assert.calledOnce(verifyStub);

      should.notEqual(user.token, token);
    });

    it("should call verify if token null", () => {
      token = null;

      verifyStub.withArgs(token, process.env.JWT_SECRET);
      sinon.assert.calledOnce(verifyStub);

      should.notEqual(user.token, token);
    });

    it("should call findById if token valid", () => {
      userId = "5f1f31dd172af82b8cf91182";

      findByIdStub.withArgs(userId);
      should.equal(userModel.findById(userId), user);
      sinon.assert.calledOnce(findByIdStub);
    });

    it("should call findById if token null", () => {
      userId = null;
      findByIdStub.withArgs(userId);
      sinon.assert.calledOnce(findByIdStub);
      should.notEqual(userModel.findById(userId), user);
    });

    it("should call findById if token invalid", () => {
      userId = "5f1f31";

      findByIdStub.withArgs(userId);
      sinon.assert.calledTwice(findByIdStub);
      should.notEqual(userModel.findById(userId), user);
    });

    it("should throw error", () => {
      should.exists(result instanceof UnauthorizedError);
    });
  });
});
