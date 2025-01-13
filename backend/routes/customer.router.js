import express from "express";
import {editCustomer, getChatPage, loadIndexPage, logingCustomer, logoutCustomer, postEditCustomer, registerCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", loadIndexPage);
router.post("/", logingCustomer);
router.get("/chat", getChatPage);
router.post("/register", registerCustomer);
router.get("/logout", logoutCustomer);
router.get("/edit", editCustomer);
router.post("/edit", postEditCustomer);

export default router;