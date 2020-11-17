import request from "supertest";
import { app } from "../../app";

it("service has a route handler listening to /api/products with post", async () => {
  const response = await request(app).post("/api/products").send({});

  expect(response.status).not.toEqual(404);
});

it("only accessible if user is authenticated", async () => {
  await request(app).post("/api/products").send({}).expect(401);
});

it("service has a route handler listening to /api/products", async () => {});

it("service has a route handler listening to /api/products", async () => {});
