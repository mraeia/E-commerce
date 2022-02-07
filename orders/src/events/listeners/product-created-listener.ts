import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductCreatedEvent } from "@maly-ecom/common";
import { Product } from "../../models/product";
import { queueGroupName } from "./queue-group-name";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(
    parsedMessage: ProductCreatedEvent["data"],
    message: Message
  ) {
    const { id, title, price } = parsedMessage;

    const product = Product.build({ id, title, price });

    await product.save();
    message.ack();
  }
}
