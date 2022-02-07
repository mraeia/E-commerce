import { body } from "express-validator";
import express, { Request, Response } from "express";
import { requireAuth, validateReq } from "@maly-ecom/common";
import { Product } from "../models/product";
import { ProductCreatedPublisher } from "../events/publishers/product-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/products",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Must be a valid title"),
    body("price").isFloat({ gt: 0 }).withMessage("Must be a valid price"),
  ],
  validateReq,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const product = Product.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await product.save();

    new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      userId: product.userId,
      version: product.version,
    });

    res.status(200).send(product);
  }
);

export { router as createProductRouter };
