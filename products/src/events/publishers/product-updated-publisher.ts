import { Publisher, Subjects, ProductUpdatedEvent } from "@maly-ecom/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  readonly subject = Subjects.ProductUpdated;
}
