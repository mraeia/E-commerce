import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ProductAttrs {
  id: string;
  title: string;
  price: number;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
