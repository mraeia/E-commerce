import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ProductUpdatedEvent } from "@maly-ecom/common";
import { ProductUpdatedListener } from "../product-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product";

jest.mock("../../../nats-wrapper");

const setup = async () => {
  const listener = new ProductUpdatedListener(natsWrapper.client);

  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();

  const data: ProductUpdatedEvent["data"] = {
    id: product.id,
    version: product.version + 1,
    title: "shirt",
    price: 999,
    userId: "ablskdjf",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, product, listener };
};

it("finds, updates, and saves a product", async () => {
  const { msg, data, product, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { msg, data, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
