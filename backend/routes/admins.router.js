import express from "express";
import { adminAddRoom, adminAddRoomPage, adminGetAllRooms, adminRoomDelete, adminRoomEdit, adminRoomEditPage } from "../controllers/admins.controller.js";

const router = express.Router();

router.get("/rooms",adminGetAllRooms);
router.get("/rooms/add", adminAddRoomPage);
router.post("/rooms/add", adminAddRoom);
router.post("/rooms/edit", adminRoomEdit);
router.get("/rooms/edit/:id", adminRoomEditPage);
router.get("/rooms/delete/:id", adminRoomDelete);

export default router;