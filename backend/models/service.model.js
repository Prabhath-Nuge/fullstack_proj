import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String}
})

const Service = mongoose.model("Service",serviceSchema);

export default Service;