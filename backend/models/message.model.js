import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true},
    messages: [{
        text: { type: String, required: true, },
        timestamp: { type: Date, default: Date.now, },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", },
    },],
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
