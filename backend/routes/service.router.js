import express from "express";
import { addService, deleteService, getAllServices, getService, updateService } from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", addService);
router.get("/", getAllServices);
router.get("/:id", getService);
router.get("/delete/:id", deleteService);
router.post("/update/:id", updateService);

export default router;