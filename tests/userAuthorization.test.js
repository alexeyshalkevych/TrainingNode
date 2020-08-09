const sinon = require("sinon");
const mongoose = require("mongoose");
const userModel = require("../src/users/userModel");
const { userAuthorization } = require("../src/middlewares/userMiddlewares");
const jwt = require("jsonwebtoken");
const assert = require("assert");
const { UnauthorizedError } = require("../src/helpers/usersHelpers");
require("dotenv").config();

describe("Unit test for user authorization case", () => {
  describe("when all good", () => {
    let req, res, next, findByIdStub, verifyTokenStub, sandbox;

    const userId = "some_user_id";
    const user = { id: "some_user_id" };
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      get(headerName) {
        return this.headers[headerName.toLowerCase()];
      },
      user: {
        token,
      },
    };

    before(async () => {
      sandbox = sinon.createSandbox();

      res = {
        status: sandbox.stub().returns(res),
        send: sandbox.stub().returns(res),
      };

      next = sandbox.stub();

      findByIdStub = sandbox
        .stub(userModel, "findById")
        .returns({ id: "user_id_from_db", token });
      verifyTokenStub = sandbox.stub(jwt, "verify").returns(user.id);

      await userAuthorization(req, res, next);
    });

    after(() => {
      sandbox.restore();
    });

    it("should not call res.status", () => {
      sinon.assert.notCalled(res.status);
    });

    it("should not call res.send", () => {
      sinon.assert.notCalled(res.send);
    });

    it("should call jwt verify once", () => {
      sinon.assert.calledOnce(verifyTokenStub);
      sinon.assert.calledWithExactly(
        verifyTokenStub,
        token,
        process.env.JWT_SECRET
      );
    });

    it("should call userModel findById once", () => {
      sinon.assert.calledOnce(findByIdStub);
      sinon.assert.calledWithExactly(
        findByIdStub,
        verifyTokenStub(token, process.env.JWT_SECRET).id
      );
    });

    it("should call next once", () => {
      sinon.assert.calledOnce(next);
      sinon.assert.calledWithExactly(next);
    });
  });

  describe("when token none", () => {
    let req, res, next, findByIdStub, verifyTokenStub, sandbox;

    before(async () => {
      sandbox = sinon.createSandbox();

      req = {
        headers: {},
        get(headerName) {
          return this.headers[headerName.toLowerCase()] || "";
        },
      };

      res = {
        status: sandbox.stub().returns(res),
        send: sandbox.stub().returns(res),
      };

      next = sandbox.stub();

      findByIdStub = sandbox.stub(userModel, "findById");
      verifyTokenStub = sandbox.stub(jwt, "verify");

      await userAuthorization(req, res, next);
    });

    after(() => {
      sandbox.restore();
    });

    it("should call res.status once", () => {
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWithExactly(res.status, 401);
    });

    it("should call jwt verify once", () => {
      sinon.assert.calledOnce(verifyTokenStub);
      sinon.assert.calledWithExactly(
        verifyTokenStub,
        "",
        process.env.JWT_SECRET
      );
    });

    it("should not call userModel findById", () => {
      sinon.assert.notCalled(findByIdStub);
    });

    it("should call next once", () => {
      sinon.assert.calledOnce(next);
      sinon.match.instanceOf(UnauthorizedError);
    });
  });

  describe("when token not valid", () => {
    let req, res, next, findByIdStub, verifyTokenStub, sandbox;

    before(async () => {
      sandbox = sinon.createSandbox();

      req = {
        headers: {
          authorization: "",
        },
        get(headerName) {
          return this.headers[headerName.toLowerCase()] || "";
        },
      };

      res = {
        status: sandbox.stub().returns(res),
        send: sandbox.stub().returns(res),
      };

      next = sandbox.stub();

      findByIdStub = sandbox.stub(userModel, "findById");
      verifyTokenStub = sandbox.stub(jwt, "verify");

      await userAuthorization(req, res, next);
    });

    after(() => {
      sandbox.restore();
    });

    it("should call res.status once", () => {
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWithExactly(res.status, 401);
    });

    it("should call jwt verify once", () => {
      sinon.assert.calledOnce(verifyTokenStub);
      sinon.assert.calledWithExactly(
        verifyTokenStub,
        "",
        process.env.JWT_SECRET
      );
    });

    it("should not call userModel findById", () => {
      sinon.assert.notCalled(findByIdStub);
    });

    it("should call next once", () => {
      sinon.assert.calledOnce(next);
      sinon.match.instanceOf(UnauthorizedError);
    });
  });
});
