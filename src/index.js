const express=require("express")
const mongoose=require("mongoose")
const route=require("./routes/route.js")
mongoose.set('strictQuery',true)

const app=express()

app.use(express.json())

mongoose.connect("mongodb+srv://ajit07:zsSSEqn97gvLXrGS@cluster0.d3veclf.mongodb.net/StudentRecords")
.then(()=>{console.log("DB connected")})
.catch((error)=>{console.log(error)})

app.use('/',route)

app.listen(3000,()=>{
    console.log("Server running on port "+ 3000)
})