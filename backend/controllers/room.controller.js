import Room from "../models/room.model.js";

export const getRooms = async (req,res) => {
    const rooms = await Room.find();
    return res.send(rooms);
};

export const addRoom = async (req,res) => {
    const { roomType, bedType, price, status } = req.body;

    if (!roomType || !bedType || !price || !status) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const isAvailable = Room.find({roomType:roomType});

        if(isAvailable){
            return res.send({success:false,message:"That room Type Allready Exists"});
        }
        const newRoom = new Room({
            roomType,
            bedType,
            price,
            status
        });
    
        await newRoom.save();
        console.log("New Room Registered :"+newRoom);
        res.render("room.ejs", {success:true, message:"Added room successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false,message: `An error occurred while adding the room${error}` });
    }
};

export const deleteRoom = async (req, res) => {
    const roomId = req.params.id; // Assuming the room ID is passed as a URL parameter

    try {
        const deletedRoom = await Room.findByIdAndDelete(roomId);
        if (deletedRoom) {
            res.status(200).send({ success: true, message: "Room deleted successfully", room: deletedRoom });
        } else {
            res.status(404).send({success: false, message: "Room not found" });
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).send({ message: "Internal server error" });
    }
};

export const updateRoom = async (req,res) => {
    const { roomType, bedType, price, status, roomId} = req.body;

    if (!roomType || !bedType || !price || !status || !roomId) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const isAvailable = await Room.findById(roomId);
        if(!isAvailable){
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        const updatedRoom = await Room.findByIdAndUpdate(roomId,{
            roomType,
            bedType,
            price,
            status
        }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        console.log("Room Updated: ", updatedRoom);
        return res.json({ success: true, message: "Room updated successfully", room: updatedRoom });
        
        
    } catch (error) {
        console.error("Error updating room: ", error);
        return res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
    }
}

export const getOneRoom = async (req,res) => {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);    

    try {
        if(room){
            res.status(200).send({success:true,message:"Room available",room:room});
        }else{
            res.status(404).send({success:false,message:"Room not found"});
        }
    } catch (error) {
        res.status(502).send({success:false,message:`Error occured ${error.message}`});
    }
};