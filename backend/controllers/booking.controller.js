import Room from "../models/room.model.js";
import Service from "../models/service.model.js";
import Booking from "../models/booking.model.js";

export const getBookingPage = async (req, res) => {
    const roomId = req.params.id;
    const cusId = req.session.cus;

    try {
        const rooms = await Room.find();
        if (!roomId) {
            return res.status(404).render("room.ejs", { success: false, message: "Access Denied!!", data: rooms });
        };
        if (!cusId) {
            return res.status(404).render("room.ejs", { success: false, message: "Please Log in", data: rooms });
        }

        const room = await Room.findById(roomId);
        const services = await Service.find();

        res.render("booking.ejs", { data: { room, cusId, services } });
    } catch (error) {
        return res.status(404).render("index.ejs", { success: false, message: "Rooms loading error : " + error });
    }

};

export const addBooking = async (req, res) => {
    const services = req.body.selectedServices;
    const roomId = req.body.roomId;
    const checkin = req.body.checkin;
    const checkout = req.body.checkout;
    const cusId = req.session.cus._id;

    try {
        const rooms = await Room.find();
        if (!services || !roomId || !checkin || !checkout) {
            console.log("fk 1");

            return res.status(400).render("room.ejs", { success: false, message: "All fields are required!", data: rooms });
        }

        const newBooking = new Booking({
            roomId,
            cusId,
            checkin,
            checkout,
            status:"Ongoing",
            services
        });

        await newBooking.save();
        res.status(200).render("room.ejs", { success: true, message: "Booking Added Successfully", data: rooms });

    } catch (error) {
        const rooms = await Room.find();
        res.status(200).render("room.ejs", { success: false, message: `Error Occured ${error}`, data: rooms });
    }

};

export const getAllOngoingBooks = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(401).render("index.ejs", {success: false, message: "Please log in first!"});
        }
        const cusId = req.session.cus._id;

        const bookings = await Booking.find({ cusId: cusId, status: "Ongoing" }).populate("roomId").exec();

        res.render("booking_history.ejs", { data: bookings });
    } catch (error) {
        console.error("Error fetching ongoing bookings:", error);
        res.status(500).render("index.ejs", {success: false,message: "Error loading bookings. Please try again later."});
    }
};


export const getAllCanceledBooks = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(401).render("index.ejs", {success: false, message: "Please log in first!"});
        }
        const cusId = req.session.cus._id;

        const bookings = await Booking.find({ cusId: cusId, status: "canceled" }).populate("roomId").exec();
        
        res.render("booking_canceled_history.ejs", { data: bookings });
    } catch (error) {
        console.error("Error fetching ongoing bookings:", error);
        res.status(500).render("index.ejs", { message: "Error loading bookings." });
    }
};

export const getAllCompletedBooks = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(401).render("index.ejs", {success: false, message: "Please log in first!"});
        }
        const cusId = req.session.cus._id;

        const bookings = await Booking.find({ cusId: cusId, status: "completed" }).populate("roomId").exec();
        
        res.render("booking_completed_history.ejs", { data: bookings });
    } catch (error) {
        console.error("Error fetching ongoing bookings:", error);
        res.status(500).render("index.ejs", {success:false, message: "Error loading bookings." });
    }
};

export const cancelBook = async (req,res)=>{
    try {
        const bookId = req.params.id;
    await Booking.findByIdAndUpdate(bookId,{status:"canceled"});
    res.redirect("/book/canceledbooking");
    } catch (error) {
        res.status(500).render("index.ejs", {success:false, message: "Error loading bookings." });
    }
};

export const geteditBookpage = async(req,res)=>{
    const bookId = req.params.id;
    const booking = await Booking.findById(bookId).populate("roomId").populate("services").exec();
    if (!booking) {
        return res.status(404).render("index.ejs",{ success: false, message: "Booking not found" });
    }

    res.render("edit_booking.ejs", { data: booking });
};

export const editBooking = async (req,res)=>{
    const {checkin, checkout} = req.body;
    const bookId = req.params.id;

    const updatedBooking = await Booking.findByIdAndUpdate(bookId,{checkin,checkout});

    if (!updatedBooking) {
        return res.status(404).render("index.ejs",{ success: false, message: "Booking not found." });
    }
    res.status(200).render("index.ejs",{success: true,message: "Booking updated successfully."});
};