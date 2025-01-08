import mongoose, { model } from "mongoose";

const bookingSchema = mongoose.Schema({
    roomId:{type: mongoose.Schema.Types.ObjectId, ref: "Room",required:true},
    cusId:{type: mongoose.Schema.Types.ObjectId, ref: "Customer", required:true},
    checkin:{type: String, required: true},
    checkout:{type: String, required: true},
    status:{type: String, required: true},
    services:[{type: mongoose.Schema.Types.ObjectId, ref: "Service"}]
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;