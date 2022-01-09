import { Subjects } from "./subjects";

interface ProductCreatedEvent {
  subject: Subjects.ProductCreated;
  data: {
    id: string;
  };
}
