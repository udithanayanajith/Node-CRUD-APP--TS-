import express from 'express'
import connectDB  from "./lib/db"
import prodRoute from "./routes/items"
const app=express()
connectDB();
app.use("/api/prod",prodRoute)
app.get("/",(req,res)=>{
    res.send("Hello world")
})
app.listen(3000,()=>{
    console.log("Serever is started on port 3000");
    
})