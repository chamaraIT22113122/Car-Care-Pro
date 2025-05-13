import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://ccp:ccp@carcarepro.lwncfzk.mongodb.net/carcarepro?retryWrites=true&w=majority')
    .then(()=>console.log("DB Connected"))
}