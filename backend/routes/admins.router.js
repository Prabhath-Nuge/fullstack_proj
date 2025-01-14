import express from "express";
import { adminAddAdmin, adminAddRoom, adminAddRoomPage, adminDeleteAdmin, adminEditAdmin, adminGetAddAdminPage, adminGetAdminEditPage, adminGetAdmins, adminGetAllRooms, adminRoomDelete, adminRoomEdit, adminRoomEditPage } from "../controllers/admins.controller.js";

const router = express.Router();

router.get("/rooms",adminGetAllRooms);
router.get("/rooms/add", adminAddRoomPage);
router.post("/rooms/add", adminAddRoom);
router.post("/rooms/edit", adminRoomEdit);
router.get("/rooms/edit/:id", adminRoomEditPage);
router.get("/rooms/delete/:id", adminRoomDelete);
router.get("/admins",adminGetAdmins);
router.get("/edit/:id", adminGetAdminEditPage);
router.post("/admin/save", adminEditAdmin);
router.get("/admin/delete/:id", adminDeleteAdmin);
router.get("/addadmin", adminGetAddAdminPage);
router.post("/addadmin", adminAddAdmin);


export default router;