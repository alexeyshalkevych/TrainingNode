const startServer = require("../server");
const request = require("supertest");
const should = require("should");
const { UnauthorizedError } = require("../helpers/usersHelpers");
const userModel = require("../users/userModel");
const {
  Types: { ObjectId },
} = require("mongoose");

describe("Acceptance tests for users endpoint case", () => {
  let server;

  before(async () => {
    process.env.SILENT = false;
    server = await startServer();
  });

  after(() => {
    server.close();
    process.env.SILENT = true;
  });

  describe("PATCH /api/v1/users/avatars", () => {
    context("when everything good", () => {
      const userId = ObjectId("5f1f31dd172af82b8cf91182");
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMWYzMWRkMTcyYWY4MmI4Y2Y5MTE4MiIsImlhdCI6MTU5NjAyMzU4MCwiZXhwIjoxNTk2MTA5OTgwfQ.cfGHG0gVGYr4hKulTVejxOEkVk7Ym5JAS3R_ya4erLM";

      const avatarURL =
        "http://localhost:4242/images/b87a9175-0027-4b7f-8714-628b500660f0.png";

      before(async () => {
        await userModel.findByIdAndUpdate(userId, {
          avatarURL,
        });
      });

      it("should return status code 200 OK", async () => {
        await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .attach(
            "avatar",
            "src/public/images/b87a9175-0027-4b7f-8714-628b500660f0.png"
          )
          .expect(200);
      });

      it("should return correct response body", async () => {
        await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .attach(
            "avatar",
            "src/public/images/b87a9175-0027-4b7f-8714-628b500660f0.png"
          )
          .expect("Content-Type", /json/);
      });

      it("should contains correct user avatarurl in user-collections", async () => {
        const res = await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .attach(
            "avatar",
            "src/public/images/b87a9175-0027-4b7f-8714-628b500660f0.png"
          );

        const user = await userModel.findOne({ ...res.body });

        should.exists(user.avatarURL);
      });
    });

    context("when existing errors", () => {
      const token = "not_valid_token";

      it("should return status code 401 error", async () => {
        await request(server)
          .patch("/api/v1/users/avatars")
          .set("Authorization", `Bearer ${token}`)
          .send({})
          .expect(401);
      });

      it("should throw Not Authorization error", () => {
        should.throws(UnauthorizedError);
      });
    });
  });
});
