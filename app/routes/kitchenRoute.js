import express from "express";
import { kitchenInsert, kitchenList, kitchenById, kitchenDelete, kitchenUpdate } from "../controllers/kitchenController";

const router = express.Router();

router.post("/", kitchenInsert);
router.get("/", kitchenList);
router.get("/:id", kitchenById);
router.delete("/:id", kitchenDelete);
router.put("/:id", kitchenUpdate);

export default router;
