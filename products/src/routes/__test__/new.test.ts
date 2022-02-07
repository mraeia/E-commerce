import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";

jest.mock("../../nats-wrapper.ts");

it("service has a route handler listening to /api/products with post", async () => {
  const response = await request(app).post("/api/products").send({});

  expect(response.status).not.toEqual(404);
});

it("service only accessible if user is authenticated", async () => {
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.signup())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("service returns an error if no title/empty title is provided for product", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.signup())
    .send({ price: 1 })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signup())
    .send({
      title: "",
      price: 1,
    })
    .expect(400);
});

it("service returns an error if no price/incorrect price is provided for product", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.signup())
    .send({
      title: "hello",
    })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signup())
    .send({
      title: "hello",
      price: -1,
    })
    .expect(400);
});

it("service creates a product", async () => {
  let products = await Product.find({});

  expect(products.length).toEqual(0);
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.signup())
    .send({
      title: "tshirt",
      price: 20,
    });

  products = await Product.find({});
  expect(response.body.title).toEqual("tshirt");
  expect(products.length).toEqual(1);
});
