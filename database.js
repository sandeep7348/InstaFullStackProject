require("dotenv").config()
const mongoose=require("mongoose")

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to database")
 } 

 module.exports=connectDB
