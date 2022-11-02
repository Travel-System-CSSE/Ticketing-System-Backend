const request = require("supertest");
const app = require("./server");
const CommonConstants = require("./CommonConstants");

// test cases for Credit API
describe("Credit API", function () {
  let creditId;
  let userId;
  //Add credit to the user account POSITIVE
  it("POST /credit", async function () {
    const response = await request(app)
      .post(CommonConstants.CREDIT)
      .send({ amount: 600, userId: "635bacf8ab3f8bec3a4e0230" })
      .set("Accept", "application/json");
    userId = response.body.data.credit.userId;
    creditId = response.body.data.credit._id;
    expect(response.status).toEqual(201);
    expect(response.body.data.credit).toEqual({
      amount: 600,
      userId: "635bacf8ab3f8bec3a4e0230",
      _id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      __v: expect.any(Number),
    });
  });

  // Add credit to the user account NEGATIVE

  it("POST /credit", async function () {
    const response = await request(app)
      .post(CommonConstants.CREDIT)
      .send({ amount: -2, userId: "635bacf8ab3f8bec3a4e0230" })
      .set("Accept", "application/json");
    expect(response.body.result.errors.amount.message).toEqual(
      CommonConstants.INVALID_CREDIT_ADD
    );
  });

  // Get credit from user POSITIVE

  it("GET /credit/:id", async function () {
    const response = await request(app)
      .get(CommonConstants.CREDIT + `/${userId}`)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body.documents).toEqual([
      {
        _id: expect.any(String),
        amount: expect.any(Number),
        userId: userId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    ]);
  });

  // Get credit from user NEGATIVE

  it("GET /credit/:id", async function () {
    const id = "6767575675";
    const response = await request(app)
      .get(CommonConstants.CREDIT + `/${id}`)
      .set("Accept", "application/json");
    expect(response.status).toEqual(404);
    expect(response.body.msg).toEqual(CommonConstants.INVALID_USER_ID);
  });

  //Delete credit from database
  it("DELETE /:id", async function () {
    const response = await request(app)
      .delete(CommonConstants.CREDIT + `/${creditId}`)
      .set("Accept", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      msg: CommonConstants.CREDIT_DELETE,
    });
  });
});
