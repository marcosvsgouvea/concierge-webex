import express from "express";
import { roomInsert, roomList, roomById, roomDelete, roomUpdate, updateDevices } from "../controllers/roomController";

const router = express.Router();

router.post("/", roomInsert);
router.get("/", roomList);
router.get("/devices", updateDevices);
router.get("/:id", roomById);
router.delete("/:id", roomDelete);
router.put("/:id", roomUpdate);


export default router;
