import { ProductCreatedEvent } from "@maly-ecom/common";
import { ProductCreatedListener } from "../product-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Product } from "../../../models/product";

jest.mock("../../../nats-wrapper");

const setup = () => {
  const listener = new ProductCreatedListener(natsWrapper.client);
  const data: ProductCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "shirt",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a product", async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  const product = await Product.findById(data.id);

  expect(product).toBeDefined;
  expect(product!.title).toEqual(data.title);
  expect(product!.price).toEqual(data.price);
});
