import express from "express";
import { adminChatPage, adminGetUsers, getChats, loadAdminPage } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/index", loadAdminPage);
router.get("/users", adminGetUsers);
router.get("/chat", getChats);
router.get("/:id", adminChatPage);

export default router;