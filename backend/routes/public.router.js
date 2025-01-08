import express from "express";
import { getAboutPage, getContactPage, postContactus } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/contact", getContactPage);
router.get("/about", getAboutPage);
router.post("/contact", postContactus);

export default router;