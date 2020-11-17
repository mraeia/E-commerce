import { body } from "express-validator";
import express from "express";
import { requireAuth } from "@maly-ecom/common";

const router = express.Router();

router.post("/api/products", requireAuth, (req, res) => {
  res.status(200).send({});
});

export { router as createProductRouter };
