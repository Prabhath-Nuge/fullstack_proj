import Customer from "../models/customer.model.js";
import Message from "../models/message.model.js"

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

export const getChats = async (req, res) => {
    try {
        // Find all messages, unwind the messages array, and sort by timestamp
        const messages = await Message.aggregate([
            {
                $unwind: "$messages",  // Flatten the messages array
            },
            {
                $sort: { "messages.timestamp": -1 },  // Sort by timestamp (latest message first)
            },
            {
                $group: {
                    _id: "$sender",  // Group by sender to get the last message from each sender
                    lastMessage: { $first: "$messages" },  // Get the first (latest) message for each sender
                    messageThreadId: { $first: "$_id" },  // Get the main message thread _id
                },
            },
            {
                $lookup: {
                    from: "customers",  // Assuming you have a `Customer` collection
                    localField: "_id",  // Match the sender field
                    foreignField: "_id",  // Match the sender in the `Customer` collection
                    as: "senderDetails",  // Populate sender details
                },
            },
            {
                $unwind: "$senderDetails",  // Unwind the senderDetails to access sender's information
            },
            {
                $lookup: {
                    from: "customers",  // Lookup sender's name in `Customer` collection for lastMessage.senderId
                    localField: "lastMessage.senderId",  // Lookup the senderId from the lastMessage field
                    foreignField: "_id",  // Match the senderId in the `Customer` collection
                    as: "lastMessageSenderDetails",  // Populate sender details of last message
                },
            },
            {
                $unwind: "$lastMessageSenderDetails",  // Unwind the sender details of the last message
            },
            {
                $project: {
                    senderId: "$_id",  // senderId will be used to identify the sender
                    senderName: "$senderDetails.name",  // sender's name
                    lastMessageText: "$lastMessage.text",  // last message text
                    lastMessageSenderName: "$lastMessageSenderDetails.name",  // name of the sender of the last message
                    messageThreadId: 1,  // Include the main message thread _id
                    timestamp: "$lastMessage.timestamp",  // timestamp of the last message
                },
            },
        ]);

        // Render the adminchat page and pass the messages to it
        res.render("adminchat.ejs", { messages });
    } catch (error) {
        console.error("Error fetching chat data:", error);
        res.status(500).send("Error fetching chat data.");
    }
};


export const adminChatPage = async (req,res)=>{
    const mid = req.params.id;
    const messages = await Message.findById(mid).populate('messages.senderId', 'name');  // Populate senderId inside messages with 'name'

    // Render the view with the populated data
    res.render("adminchatpage.ejs", { data:messages});
    
};