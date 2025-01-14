import Customer from "../models/customer.model.js";
import Room from "../models/room.model.js";

export const adminGetAllRooms = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const rooms = await Room.find();
    res.status(200).render("adminrooms.ejs",{data:rooms});
};

export const adminRoomEditPage = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const id = req.params.id;
    const room = await Room.findById(id);
    res.status(200).render("adminroomedit.ejs",{data:room});
};

export const adminRoomEdit = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const {id,roomType,bedType,price,image} = req.body;
    if(!id || !roomType || !bedType || !price || !image){
        return res.status(400).render("adminIndex.ejs", { success: false, message: "Every field is required" });
    }

    const updateRoom = await Room.findByIdAndUpdate(id,{roomType,bedType,price,image});
    res.status(200).render("adminIndex.ejs",{success:true,message:"Room Updated!!"});
}

export const adminRoomDelete = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }
    const id = req.params.id;
    if(!id){
        return res.status(400).render("adminIndex.ejs", { success: false, message: "Invalid Entry" });
    }

    const deletedRoom = await Room.findByIdAndDelete(id);
    res.status(200).render("adminIndex.ejs",{success:true,message:"Room Deleted!!"});
};

export const adminAddRoomPage = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    res.status(200).render("adminaddroom.ejs");

};

export const adminAddRoom = async (req,res)=>{
    try {
        if (!req.session.cus || !req.session.cus._id) {
            return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
        }
        else if (!(req.session.cus.type == "admin")) {
            return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
        }
    
        const {roomType,bedType,price,image} = req.body;
        if(!roomType || !bedType || !price || !image){
            return res.status(400).render("adminIndex.ejs", { success: false, message: "Every field is required" });
        }
    
        const newRoom = new Room({
            roomType, bedType, price, image, status:true
        });
        await newRoom.save();
        res.status(200).render("adminIndex.ejs",{success:true,message:"Room added successfully"});
    } catch (error) {
        console
        return res.status(500).render("index.ejs", { success: false, message: "Error : "+error });
    }

};

export const adminGetAdmins = async (req,res)=>{
    if (!req.session.cus) {
        return res.render("index.ejs", { success: false, message: "You must log in first" });
    }
    if (req.session.cus.type == "admin") {
        const customers = await Customer.find({ type: "admin" });
        res.render("admingetadmins.ejs", { data: customers });
    } else {
        return res.render("index.ejs", { success: false, message: "You must log in first" });
    }
}

export const adminGetAdminEditPage = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const id = req.params.id;
    if(!id){
        return res.status(400).render("adminIndex.ejs",{success:false,message:"Unauthorized!"});
    }

    const admin = await Customer.findById(id);
    res.status(200).render("admineditadmin.ejs",{data:admin});
}

export const adminEditAdmin = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    try {
        const {id,name,email,pnumber,address,dob,password,} = req.body;
        if(!id||!name||!email||!pnumber||!address||!dob||!password){
            return res.status(400).render("index.ejs",{success:false,message:"Must fill all required fields!"});
        }
    
        const newCus = await Customer.findByIdAndUpdate(id,{
            name,email,pnumber,address,dob,password
        },{new:true});
    
        if(newCus){
            req.session.cus = newCus;
            return res.status(200).render("index.ejs",{success:true,message:"Updated Successfully"});
            
        }else{
            return res.status(400).render("index.ejs",{success:true,message:"Something Went Wrong!"});
        }
    } catch (error) {
        return res.status(500).render("index.ejs",{success:false,message:"Server Error:"+error});
    }
}

export const adminDeleteAdmin = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    const id = req.params.id;
    const deleteUser = await Customer.findByIdAndDelete(id);
    res.status(200).render("adminIndex.ejs",{success:true,message:"Deleted Successfully"});
}

export const adminGetAddAdminPage = async (req,res)=>{
    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

    res.status(200).render("adminaddadmin.ejs");
    
}

export const adminAddAdmin = async (req,res)=>{
    const { name, email, pnumber, address, dob, password } = req.body;

    if (!req.session.cus || !req.session.cus._id) {
        return res.status(400).render("index.ejs", { success: false, message: "Please log in first!" });
    }
    else if (!(req.session.cus.type == "admin")) {
        return res.status(400).render("index.ejs", { success: false, message: "You are not an Admin" });
    }

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
            type: "admin"
        });
        await newUser.save();
        console.log("User registered successfully:", newUser);
        res.render("index", { success: true, message: "Registered Successfully! Now you can Login." });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
}