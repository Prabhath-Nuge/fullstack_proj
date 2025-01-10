import express from "express";
import {loadAdminPage, loadIndexPage, logingCustomer, logoutCustomer, registerCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", loadIndexPage);

router.post("/", logingCustomer);

router.post("/register", registerCustomer);

router.get("/logout", logoutCustomer);

router.get("/admin/index", loadAdminPage);

export default router;