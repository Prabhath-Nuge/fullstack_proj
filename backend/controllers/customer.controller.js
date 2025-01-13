import Customer from "../models/customer.model.js";
import Message from "../models/message.model.js";
import Room from "../models/room.model.js";

export const loadIndexPage = (req, res) => {
    res.render("index.ejs");
};

export const logingCustomer = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.render("index.ejs", { success: false, message: "Enter email and password!!" });
    }
    try {
        if (req.session.cus) {
            if(req.session.cus.type == "admin"){
                return res.render("adminIndex.ejs", { success: true, message: "You are allready logged in!" });
            }else{
                return res.render("index.ejs", { success: true, message: "You are allready logged in!" });
            }
        } else {
            const cus = await Customer.findOne({ email: email, password: password });
            if (cus) {
                req.session.cus = cus;
                const rooms = await Room.find();
                if(cus.type == "admin"){
                    return res.render("adminIndex.ejs");
                }else{
                    return res.render("room.ejs", { success: true, message: "Logged in Successfully!!", data: rooms });
                }
            } else {
                return res.render("index.ejs", { success: false, message: "No user!!" });
            }
        }
    } catch (error) {
        return res.render("index.ejs", { success: false, message: `Error : ${error}` });
    }

};

export const registerCustomer = async (req, res) => {
    const { name, email, pnumber, address, dob, password } = req.body;

    if (!name || !email || !pnumber || !address || !dob || !password) {
        console.log("All fields are required.");
        return res.status(400).send("All fields are required.");
    }

    try {
        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            console.log("User already exists with this email.");
            return res.status(400).send("User already exists.");
        }
        const newUser = new Customer({
            name,
            email,
            pnumber,
            address,
            dob,
            password,
            type: "customer"
        });
        await newUser.save();
        console.log("User registered successfully:", newUser);
        res.render("index", { success: true, message: "Registered Successfully! Now you can Login." });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
};

export const logoutCustomer = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.redirect("/");
        }
        res.redirect("/");
    });
};

export const getChatPage = async (req, res) => {
    try {
        const messagesData = await Message.find({ sender: req.session.cus._id })
            .populate("messages.senderId")
            .sort({ "messages.timestamp": 1 });

        res.render("chat.ejs", { data: messagesData });
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).send("Internal Server Error");
    }
};
