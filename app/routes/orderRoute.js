import express from "express";
import { orderInsert, orderList, orderById, orderDelete, orderUpdate, orderInsertRoom } from "../controllers/orderController";

const router = express.Router();

router.post("/", orderInsert);
router.post("/room", orderInsertRoom);
router.get("/", orderList);
router.get("/:id", orderById);
router.delete("/:id", orderDelete);
router.put("/:id", orderUpdate);

export default router;
