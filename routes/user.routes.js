const express=require("express")
const router=express.Router()
const User=require("../models/user.model")
const Followers=require("../models/follower.model")
const IdentifyUser=require("../middlewares/post.middleware")

router.post("/follow/:username",IdentifyUser,async(req,res)=>{
    try{
        const follower=req.user.username
        const followee=req.params.username
        const userToFollow=await User.findOne({username:followee})
        if(!userToFollow){
            return res.status(404).json({message:"User not found"})
        }
        if(follower.toString()===followee){
            return res.status(400).json({message:"You cannot follow yourself"})
        }
        const existingFollow=await Followers.findOne({follower,followee})
        if(existingFollow){
            return res.status(400).json({message:"You are already following this user"})
        }
        const newFollow=await Followers.create({follower,followee})
        res.status(201).json({message:"User followed successfully",follow:newFollow})
    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})
router.post("/unfollow/:username",IdentifyUser,async(req,res)=>{
    try{
        const follower=req.user.username
        const followee=req.params.username
        const userToUnfollow=await User.findOne({username:followee})
        if(!userToUnfollow){
            return res.status(404).json({message:"User not found"})
        }
        if(follower.toString()===followee){
            return res.status(400).json({message:"You cannot unfollow yourself"})
        }
        const existingFollow=await Followers.findOne({follower,followee})
        if(!existingFollow){
            return res.status(400).json({message:"You are not following this user"})
        }
        await Followers.findOneAndDelete({follower,followee})
        res.status(200).json({message:"User unfollowed successfully"})

    }
    catch(error){
        res.status(500).json({message:"Internal server error"})
    }

})



module.exports=router