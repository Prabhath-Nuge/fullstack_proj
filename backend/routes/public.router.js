import express from "express";
import { getAboutPage, getContactPage } from "../controllers/public.controller.js";

const router = express.Router();

router.get("/contact", getContactPage);
router.get("/about", getAboutPage);

export default router;