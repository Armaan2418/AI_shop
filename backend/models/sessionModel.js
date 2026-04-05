import mongoose from "mongoose";
import { User } from  "./userModel.js";


const sessionSchema = new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})



export const Session = mongoose.model('Session',sessionSchema)