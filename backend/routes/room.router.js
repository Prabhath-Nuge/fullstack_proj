import express from "express";
import { addRoom, deleteRoom, getOneRoom, getRooms, updateRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/",addRoom);
router.get("/:id", getOneRoom);
router.get("/", getRooms);
router.delete("/:id", deleteRoom);
router.put("/", updateRoom);

export default router;