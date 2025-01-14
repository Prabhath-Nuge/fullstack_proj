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