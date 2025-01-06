import mongoose, { mongo } from "mongoose";

const roomSchema = mongoose.Schema({
    roomType:{type: String,required: true},
    bedType:{type: String,required: true},
    price:{type: Number,required:true},
    status:{type: Boolean,required: true},
    image:{type: String}
});

const Room = mongoose.model('Room', roomSchema);

export default Room;