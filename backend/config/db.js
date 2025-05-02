import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://budwin:itpm1234@service.kt76xil.mongodb.net/?retryWrites=true&w=majority&appName=service')
    .then(()=>console.log("DB Connected"))
}