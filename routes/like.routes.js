const express=require("express")

const router=express.Router()
const IdentifyUser=require("../middlewares/post.middleware.js")
const Post=require("../models/post.models.js")
const Like=require("../models/like.model.js")

router.post("/like/:postId",IdentifyUser,async(req,res)=>{
      try{
          const postId=req.params.postId
            const post=await Post.find({_id:postId})
            if(!post){
                return res.status(404).json({message:"post not found"})
            }
            const user=req.user.username
            const existingLike=await Like.findOne({postId,user})
            if(existingLike){
                return res.status(400).json({message:"post already liked"})
            }
           const newLike=await Like.create({postId,user})
           res.status(201).json({message:"post liked successfully",like:newLike})

      } catch (error) {
          return res.status(500).json({message:"internal server error"})
      }
})
router.post("/unlike/:postId",IdentifyUser,async(req,res)=>{
      try{
          const postId=req.params.postId
            const post=await Post.find({_id:postId})
            if(!post){
                return res.status(404).json({message:"post not found"})
            }
            const user=req.user.username
            const existingLike=await Like.findOne({postId,user})
            if(!existingLike){
                return res.status(400).json({message:"post not liked"})
            }
            await Like.deleteOne({postId,user})
            res.status(200).json({message:"post unliked successfully"})
      } catch (error) {
          return res.status(500).json({message:"internal server error"})
      }
})
module.exports=router