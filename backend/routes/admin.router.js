import express from "express";
import { addServiceToBook, adminAddService, adminChatPage, adminCompleteBook, adminDeleteService, adminDeleteUser, adminEditBookPage, adminGetCanceledBookings, adminGetCompletedBookings, adminGetGuestEmailpage, adminGetGuestEmails, adminGetOnBookings, adminGetServiceEdit, adminGetServices, adminGetUser, adminGetUsers, adminPostAddService, adminReplyGuestEmail, adminUpdateCus, adminUpdateService, getChats, loadAdminPage, postAddServiceToBook } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/index", loadAdminPage);
router.get("/users", adminGetUsers);
router.post("/users/edit", adminUpdateCus);
router.get("/users/edit/:id", adminGetUser);
router.get("/users/delete/:id", adminDeleteUser);
router.get("/chat", getChats);
router.get("/ongoingbook", adminGetOnBookings);
router.get("/canceledbook", adminGetCanceledBookings);
router.get("/completedbook", adminGetCompletedBookings);
router.get("/addservicetobook/:id", addServiceToBook);
router.post("/addservicetobook", postAddServiceToBook);
router.get("/editbook/:id", adminEditBookPage);
router.get("/completebook/:id", adminCompleteBook);
router.get("/services", adminGetServices);
router.get("/services/add", adminAddService);
router.post("/services/add", adminPostAddService);
router.post("/services/edit", adminUpdateService);
router.get("/services/edit/:id", adminGetServiceEdit);
router.get("/services/delete/:id", adminDeleteService);
router.post("/sendemail", adminReplyGuestEmail);
router.get("/guestemails", adminGetGuestEmails);
router.get("/guestemails/:id", adminGetGuestEmailpage);
router.get("/:id", adminChatPage);

export default router;