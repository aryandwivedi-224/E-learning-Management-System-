import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import "./models/course.model.js"; // Import Course model to register it
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js" 



dotenv.config({});

//call database connection
connectDB();

const app=express();
const port=process.env.PORT || 8080;
//default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

//apis
app.use("/api/v1/media",mediaRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/purchase",purchaseRoute);

//"http://localhost:8080/api/v1/user/register"

// app.get("/Home", (_,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"Welcome to home page and this comming from backend"
//     })  
// })


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
