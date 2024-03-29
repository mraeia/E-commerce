import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateReq,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@maly-ecom/common";
import { Product } from "../models/product";
import { ProductUpdatedPublisher } from "../events/publishers/product-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/products/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and must be greater than 0"),
  ],
  validateReq,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    product.set({
      title: req.body.title,
      price: req.body.price,
    });
    await product.save();
    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      userId: product.userId,
      version: product.version,
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
