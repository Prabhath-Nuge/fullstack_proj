import mongoose from "mongoose";

const contactusSchema = mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true},
    subject:{type: String, required:true},
    message:{type: String, required: true}
},{timestamps:true});

const Contactus = mongoose.model("Contactus", contactusSchema);

export default Contactus;