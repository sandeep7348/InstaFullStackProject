const express=require("express")
const router=express.Router()
const User=require("../models/user.model.js")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, bio, profile_url } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User({
      username,
      email,
      password,
      bio,
      profile_url,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const savedUser = await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"invalid credentials"})
    }
    res.status(200).json({
        message:"login successful",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
})

router.get("/profile/:id",async(req,res)=>{
  const user=await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    res.status(200).json({
        message:"user profile retrieved successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
})



module.exports=router