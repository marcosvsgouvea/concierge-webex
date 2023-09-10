import express from "express";
import { productInsert, productList, productById, productDelete, productUpdate, productUpdateStatus } from "../controllers/productController";

const router = express.Router();

router.post("/", productInsert);
router.get("/", productList);
router.get("/:id", productById);
router.delete("/:id", productDelete);
router.put("/:id", productUpdate);
router.put("/status/:id", productUpdateStatus);

export default router;
