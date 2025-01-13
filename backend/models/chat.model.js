import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;