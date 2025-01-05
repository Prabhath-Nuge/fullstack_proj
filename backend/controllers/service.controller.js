import Service from "../models/service.model.js";

export const addService = async(req, res)=>{
    const {name, price, image} = req.body;

    if(!name || !price){
        return res.status(406).send({success:false,message:"Doesn't find any content that conforms to the criteria given by the user agent"});
    }

    try {
        const newService = new Service({
            name,
            price,
            image
        });

        await newService.save();
        res.status(200).send({success:true,message:"Service added successfully!",data:newService});
    } catch (error) {
        return res.status(502).send({success:false,message:`Error occured ${error.message}`});
    }
};

export const getAllServices = async (req,res)=>{
    try {
        const services = await Service.find();
    if(!services){
        return res.status(404).send({success:false,message:"No services available"});
    }

    res.status(200).send({success:true,message:"Services found",data:services});
    } catch (error) {
        res.status(500).send({success:false,message:`Error : ${error.message}`});
    }
}

export const getService = async (req,res) => {
    const serviceId = req.params.id;

    if(!serviceId){
        return res.status(404).send({success:false,message:"Service ID required"});
    }

    try {
        const service = await Service.findById(serviceId);
        res.status(200).send({success:true,message:"Service found!",data:service});
    } catch (error) {
        res.status(500).send({success:false,message:`Error : ${error.message}`});
    }
};

export const deleteService = async (req,res) => {
    const serviceId = req.params.id;
    if(!serviceId){
        return res.status(404).send({success:false,message:"Service ID required"});
    }

    const deletedService = await Service.findByIdAndDelete(serviceId);
    res.status(200).send({success:true,message:"Service Deleted",data:deletedService});
};

export const updateService = async (req,res)=>{
    const serviceId = req.params.id;
    if(!serviceId){
        return res.status(404).send({success:false,message:"ID required"});
    }

    const {name, price, image} = req.body;

    if(!name || !price){
        return res.status(401).send({success:false,message:"Name and Price needed!"})
    }

    try {
        const service = await Service.findById(serviceId);
    if(!service){
        return res.status(404).send({success:false,message:"No Service found"});
    }

    const updatedService = await Service.findByIdAndUpdate(serviceId,{
        name,
        price,
        image
    },{new:true});
    return res.status(200).send({success:true,message:"Room Updated",data:updatedService});
    } catch (error) {
        return res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
    }
}