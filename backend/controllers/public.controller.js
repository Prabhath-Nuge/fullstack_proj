import Contactus from "../models/contactus.model.js";
import {sendEmail} from "../emailService.js";

export const getContactPage = (req,res)=>{
    res.render("contact.ejs");
}

export const getAboutPage = (req,res)=>{
    res.render("about.ejs");
}

export const postContactus = async (req,res)=>{
    const {name,email,subject,message} = req.body;
    if(!name || !email || !subject || !message){
        return res.status(400).render("contact.ejs",{success:false, message:"Complete every text box before proceeding."});
    }

    const newContactus = new Contactus({
        name,
        email,
        subject,
        message
    });

    await newContactus.save();
    const emailsubject = 'Thank You for Contacting Us';
    const text = `Dear ${name},Thank you for reaching out to us. We have received your email and will get back to you as soon as possible.If your inquiry is urgent, feel free to let us know, and we’ll do our best to prioritize it.We appreciate your patience and look forward to assisting you.`;
    
    await sendEmail({ to: email, subject: emailsubject, text:text});

    res.render("contact.ejs",{success:true, message:"Your email Send"});
};