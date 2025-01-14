import { sendEmail } from "../emailService.js";
import Booking from "../models/booking.model.js";
import Contactus from "../models/contactus.model.js";
import Customer from "../models/customer.model.js";
import Message from "../models/message.model.js"
import Service from "../models/service.model.js";

export const loadAdminPage = (req, res) => {
    if (!req.session.cus) {
        return res.render("index.ejs", { success: false, message: "You must log in first" });
    }
    if (req.session.cus.type == "admin") {
        return res.render("adminIndex.ejs");
    } else {
        return res.render("index.ejs", { success: false, message: "You must log in first" });
    }
};

export const adminGetUsers = async (req, res) => {

    if (!req.session.cus) {
        return res.render("index.ejs", { success: false, message: "You must log in first" });
    }
    if (req.session.cus.type == "admin") {
        const customers = await Customer.find({ type: "customer" });
        res.render("admingetusers.ejs", { data: customers });
    } else {
        return res.render("index.ejs", { success: false, message: "You must log in first" });
    }
};

export const getChats = async (req, res) => {
    try {
        // Find all messages, unwind the messages array, and sort by timestamp
        const messages = await Message.aggregate([
            {
                $unwind: "$messages",  // Flatten the messages array
            },
            {
                $sort: { "messages.timestamp": -1 },  // Sort by timestamp (latest message first)
            },
            {
                $group: {
                    _id: "$sender",  // Group by sender to get the last message from each sender
                    lastMessage: { $first: "$messages" },  // Get the first (latest) message for each sender
                    messageThreadId: { $first: "$_id" },  // Get the main message thread _id
                },
            },
            {
                $lookup: {
                    from: "customers",  // Assuming you have a `Customer` collection
                    localField: "_id",  // Match the sender field
                    foreignField: "_id",  // Match the sender in the `Customer` collection
                    as: "senderDetails",  // Populate sender details
                },
            },
            {
                $unwind: "$senderDetails",  // Unwind the senderDetails to access sender's information
            },
            {
                $lookup: {
                    from: "customers",  // Lookup sender's name in `Customer` collection for lastMessage.senderId
                    localField: "lastMessage.senderId",  // Lookup the senderId from the lastMessage field
                    foreignField: "_id",  // Match the senderId in the `Customer` collection
                    as: "lastMessageSenderDetails",  // Populate sender details of last message
                },
            },
            {
                $unwind: "$lastMessageSenderDetails",  // Unwind the sender details of the last message
            },
            {
                $project: {
                    senderId: "$_id",  // senderId will be used to identify the sender
                    senderName: "$senderDetails.name",  // sender's name
                    lastMessageText: "$lastMessage.text",  // last message text
                    lastMessageSenderName: "$lastMessageSenderDetails.name",  // name of the sender of the last message
                    messageThreadId: 1,  // Include the main message thread _id
                    timestamp: "$lastMessage.timestamp",  // timestamp of the last message
                },
            },
        ]);

        // Render the adminchat page and pass the messages to it
        res.render("adminchat.ejs", { messages });
    } catch (error) {
        console.error("Error fetching chat data:", error);
        res.status(500).send("Error fetching chat data.");
    }
};


export const adminChatPage = async (req, res) => {
    const mid = req.params.id;
    const messages = await Message.findById(mid).populate('messages.senderId', 'name');  // Populate senderId inside messages with 'name'

    // Render the view with the populated data
    res.render("adminchatpage.ejs", { data: messages });

};

export const adminGetUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || !req.session.cus.type == "admin") {
            return res.status(400).render("index.ejs", { success: false, message: "No user or You must Loggin as an Admin!" });
        }

        const cus = await Customer.findById(id);
        res.status(200).render("admineditcustomer.ejs", { data: cus });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }
};

export const adminUpdateCus = async (req, res) => {
    const { id, name, email, pnumber, address, dob, password, } = req.body;

    try {
        if (!id || !name || !email || !pnumber || !address || !dob || !password) {
            return res.status(400).render("index.ejs", { success: false, message: "Must fill all required fields!" });
        }

        const newCus = await Customer.findByIdAndUpdate(id, {
            name, email, pnumber, address, dob, password
        }, { new: true });

        if (newCus) {
            return res.status(200).render("index.ejs", { success: true, message: "Updated Successfully" });

        } else {
            return res.status(400).render("index.ejs", { success: true, message: "Something Went Wrong!" });
        }
    } catch (error) {
        return res.status(500).render("index.ejs", { success: false, message: "Server Error:" + error });
    }
};

export const adminDeleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id || !req.session.cus.type == "admin") {
            return res.status(400).render("index.ejs", { success: false, message: "No user or You must Loggin as an Admin!" });
        }

        const cus = await Customer.findByIdAndDelete(id);
        if (cus) {
            return res.status(200).render("index.ejs", { success: true, message: "User Deleted!!" });
        } else {
            return res.status(400).render("index.ejs", { success: false, message: "Something went Wrong!!" });
        }
    } catch (error) {
        return res.status(500).render("index.ejs", { success: false, message: "Server Error: " + error });
    }
};

export const adminGetOnBookings = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const bookings = await Booking.find({ status: "Ongoing" }).populate("roomId").populate("cusId").exec();

        res.status(200).render("admin_onbooking_history.ejs", { data: bookings });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error loading bookings. Please try again later." });
    }
};

export const adminGetCanceledBookings = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const bookings = await Booking.find({ status: "canceled" }).populate("roomId").populate("cusId").exec();

        res.status(200).render("admin_canceledbooking_history.ejs", { data: bookings });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error loading bookings. Please try again later." });
    }
};

export const adminGetCompletedBookings = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const bookings = await Booking.find({ status: "completed" }).populate("roomId").populate("cusId").exec();

        res.status(200).render("admin_completedbooking_history.ejs", { data: bookings });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error loading bookings. Please try again later." });
    }
};

export const adminGetServices = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const services = await Service.find();
        res.status(200).render("adminservice.ejs", { data: services });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }


};

export const adminGetServiceEdit = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const serviceId = req.params.id;

        if (!serviceId) {
            return res.status(400).render("index.ejs", { success: false, message: "Something went wrong!" });
        }

        const service = await Service.findById(serviceId);
        res.status(200).render("adminserviceedit.ejs", { data: service });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }
};

export const adminUpdateService = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const { id, name, price, image } = req.body;
        if (!id || !name || !price || !image) {
            return res.status(400).render("index.ejs", { success: false, message: "Every field is required" });
        }
        const updatedService = await Service.findByIdAndUpdate(id, { name, price, image });
        if (!updatedService) {
            return res.status(400).render("index.ejs", { success: false, message: "Something went wrong!!" });
        }
        res.status(200).render("index.ejs", { success: true, message: "Service Updated Successfully!!" });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }
};

export const adminDeleteService = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        const id = req.params.id;
        if (!id) {
            return res.status(400).render("index.ejs", { success: false, message: "Invalid Request!!" });
        }

        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) {
            return res.status(400).render("index.ejs", { success: false, message: "Something went wrong" });
        }

        res.status(200).render("index.ejs", { success: true, message: "Service successfully deleted!!" });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }
}

export const adminAddService = async (req, res) => {
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }

        res.status(200).render("adminaddservice.ejs");
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }
};

export const adminPostAddService = async (req, res) => {
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).render("index.ejs", { success: false, message: "Must fill all required fields!" });
    }

    const newService = new Service({
        name, price, image
    });
    const updatedService = await newService.save();
    if (!updatedService) {
        return res.status(400).render("index.ejs", { success: false, message: "Something went wrong!" });
    }
    res.status(400).render("index.ejs", { success: true, message: "New Service added Successfully" });
};

export const adminGetGuestEmails = async (req, res) => {
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const emails = await Contactus.find();
    res.status(200).render("adminguestemails.ejs", { data: emails });
};

export const adminGetGuestEmailpage = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).render("index.ejs", { success: false, message: "Not Allowed!!" });
    }
    const email = await Contactus.findById(id);
    res.status(200).render("adminguestemailshow.ejs", { data: email });
};

export const adminReplyGuestEmail = async (req, res) => {
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }
    try {
        const { id, email, subject, message } = req.body;
        if (!id || !email || !subject || !message) {
            return res.status(400).render("index.ejs", { success: false, message: "Not Allowed!!" });
        }

        const updateMessage = await Contactus.findByIdAndUpdate(id, { reply: message });
        const emailsubject = subject;
        const text = message;

        await sendEmail({ to: email, subject: emailsubject, text: text });

        res.status(200).render("index.ejs", { success: true, message: "Email send successfully" });
    } catch (error) {
        res.status(500).render("index.ejs", { success: false, message: "Error :" + error });
    }

};

export const adminEditBookPage = async (req, res) => {
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const id = req.params.id;
    const book = await Booking.findById(id).populate("roomId").populate("services").exec();

    res.status(200).render("admineditbook.ejs", { data: book });
};

export const addServiceToBook = async (req, res) => {
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const id = req.params.id;
    const services = await Service.find();
    res.status(200).render("adminaddservicetobook.ejs", { data: services, bookId: id });
};

export const postAddServiceToBook = async (req, res) => {
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    try {
        const { bookid, selectedServices } = req.body;

        const services = Array.isArray(selectedServices) ? selectedServices : [selectedServices];

        console.log('Booking ID:', bookid);
        console.log('Selected Services:', services);

        const addServices = await Booking.findByIdAndUpdate(bookid, { $addToSet: { services: { $each: services } } }, { new: true });

        res.status(200).render("adminIndex.ejs", { success: true, message: "Service added Successfully" });
    } catch (error) {
        res.status(400).render("adminIndex.ejs", { success: true, message: "Error:" + error });
    }
};

export const adminCompleteBook = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const id = req.params.id;
    const updateBook = await Booking.findByIdAndUpdate(id,{status:"completed"});

    res.status(200).render("adminIndex.ejs", { success: true, message: "Booking marked as completed!!" });
}