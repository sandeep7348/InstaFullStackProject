const mongoose=require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const postSchema=new mongoose.Schema({
    caption:{type:String,required:true},
    img_url:{
        type:String,
        required:true
    },
    user_id:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
const Post=mongoose.model("Post",postSchema)
module.exports=Post





