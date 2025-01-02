import express from "express";
import {loadIndexPage, logingCustomer, logoutCustomer, registerCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", loadIndexPage);

router.post("/", logingCustomer);

router.post("/register", registerCustomer);

router.get("/logout", logoutCustomer);

export default router;