import request from "supertest";
import { app } from "../../app";

it("status 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);
});

it("status 400 with invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "123456",
    })
    .expect(400);
});

it("status 400 with invalid password", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "12",
    })
    .expect(400);
});

it("status 400 with missing params", () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("cannot singup with an existing email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});

it("cookie set after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
