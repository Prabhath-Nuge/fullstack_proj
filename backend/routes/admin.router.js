import express from "express";
import { adminGetUsers, loadAdminPage } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/index", loadAdminPage);
router.get("/users", adminGetUsers);

export default router;