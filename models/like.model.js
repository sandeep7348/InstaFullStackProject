const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const User=require("./user.model")
const Post=require("./post.models")

const likeSchema=new mongoose.Schema({
    post_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:[true,"post_id is required"]
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user_id is required"]
    }
},{timestamps:true
})
likeSchema.index({post_id:1,user_id:1},{unique:true})

module.exports=mongoose.model("Like",likeSchema)
