const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const User=require("./user.model")
const followersSchema=new mongoose.Schema({

    follower:{
        type:ObjectId,
        ref:"User" , 
        required:[true,"follower is required"]
    },
    followee:{ 
        type:ObjectId,
        ref:"User" ,
        required:[true,"followee is required"]
    }
},{timestamps:true})
followersSchema.index({follower:1,followee:1},{unique:true})

module.exports=mongoose.model("Followers",followersSchema)