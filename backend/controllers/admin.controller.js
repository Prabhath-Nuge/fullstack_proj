import Customer from "../models/customer.model.js";

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