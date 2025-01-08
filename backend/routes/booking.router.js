import express from "express";
import { addBooking, cancelBook, editBooking, getAllCanceledBooks, getAllCompletedBooks, getAllOngoingBooks, getBookingPage, geteditBookpage } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/ongoingbooking", getAllOngoingBooks);
router.get("/canceledbooking", getAllCanceledBooks);
router.get("/completedbooking", getAllCompletedBooks);
router.post("/confirms",addBooking);
router.get("/cancel/:id", cancelBook);
router.get("/edit/:id", geteditBookpage);
router.post("/edit/:id", editBooking);
router.get("/:id", getBookingPage);


export default router;