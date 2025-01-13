import Message from "./models/message.model.js";
import Customer from "./models/customer.model.js";


export const Socket = (io)=>
    {io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // User joins a specific room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Helper function to save a message and emit events
    const handleMessage = async ({ sender, message, senderId, emitEvent, room }) => {
        console.log(`sender ${sender} message ${message} senderId ${senderId} room ${room}`);

        if (!room) {
            console.error('Room is undefined. Cannot emit to a room.');
            return;
        }

        try {
            // Find the existing message thread by sender
            let existingMessage = await Message.findOne({ sender });

            if (existingMessage) {
                // Add the new message to the existing thread
                existingMessage.messages.push({
                    text: message,
                    timestamp: new Date(),
                    senderId,
                });
                await existingMessage.save();
                console.log('Message updated in database');
            } else {
                // Create a new message thread
                const newMessage = new Message({
                    sender,
                    messages: [{
                        text: message,
                        timestamp: new Date(),
                        senderId,
                    }],
                });
                await newMessage.save();
                console.log('New message saved to database');
            }

            // Emit the event to all clients in the room, including the sender
            const senderName = await Customer.findById(senderId);
            socket.to(room).emit(emitEvent, {
                
                senderName:senderName.name, // Replace with logic to fetch the actual sender's name
                message,
            });
        } catch (err) {
            console.error('Error handling message:', err);
        }
    };

    // Client sends a message
    socket.on('sendMessage', ({ sender, message, room }) => {
        console.log(`Message from ${sender}: ${message}`);
        handleMessage({
            sender,
            message,
            senderId: sender, // Sender ID is the same for client messages
            emitEvent: 'receiveMessageAdmin',
            room,
        });
    });

    // Admin sends a message
    socket.on('sendMessageAdmin', ({ sender, message, myId, room }) => {
        console.log(`Message from ${sender}: ${message}`);
        handleMessage({
            sender,
            message,
            senderId: myId, // Admin ID is used for admin messages
            emitEvent: 'receiveMessage',
            room,
        });
    });
});
    }