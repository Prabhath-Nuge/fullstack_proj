import mongoose, { mongo } from "mongoose";

const customerSchema = mongoose.Schema({
    name:{type: String,required: true},
    email:{type: String, required: true,unique: true},
    pnumber:{type: String,required:true},
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    password:{type: String,required: true},
    type:{type: String,required: true}
},{
    timestamps:true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;