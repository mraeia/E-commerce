import { Publisher, Subjects, ProductCreatedEvent } from "@maly-ecom/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
}
