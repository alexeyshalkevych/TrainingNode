const startServer = require("../src/server");
const request = require("supertest");
const should = require("should");
const { UnauthorizedError } = require("../src/helpers/usersHelpers");
const userModel = require("../src/users/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

describe("Acceptance tests for users endpoint case", () => {
  describe("PATCH /api/v1/users/avatars", () => {
    let server;
    const userId = "5f1f31dd172af82b8cf91182";
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    before(async () => {
      process.env.SILENT = false;
      server = await startServer({
        connection: process.env.MONGODB_CONNECTION_URL_FOR_TESTS,
      });

      const password = `jrH8cFft=33>":HkKb?L`;
      const hashPassword = await bcrypt.hash(password, 6);

      await userModel.create({
        _id: userId,
        subscription: "free",
        email: "alex.code@gmail.com",
        password: hashPassword,
        avatarURL: `http://localhost:4242/images/b87a9175-0027-4b7f-8714-628b500660f0.png`,
        token,
      });
    });

    after(async () => {
      server.close();
      process.env.SILENT = true;
      await userModel.deleteMany({});
      process.exit(0);
    });

    context("when everything good", () => {
      const imageFileName = `b87a9175-0027-4b7f-8714-628b500660f0.png`;
      const avatarURL = `http://localhost:4242/images/${imageFileName}`;

      before(async () => {
        await userModel.findByIdAndUpdate(userId, {
          avatarURL,
        });
      });

      it("should return status code 200 OK", async () => {
        await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .attach("avatar", `src/public/images/${imageFileName}`)
          .expect(200);
      });

      it("should return correct response body", async () => {
        await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .attach("avatar", `src/public/images/${imageFileName}`)
          .expect("Content-Type", /json/);
      });

      it("should contains correct user avatarurl in user-collections", async () => {
        const res = await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .attach("avatar", `src/public/images/${imageFileName}`);

        const user = await userModel.findOne({ ...res.body });

        should.exists(user.avatarURL);
      });
    });

    context("when existing errors", () => {
      it("should return status code 401 error", async () => {
        await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", "")
          .send({})
          .expect(401);
      });

      it("should throw Not Authorization error", () => {
        should.throws(UnauthorizedError);
      });
    });
  });
});
