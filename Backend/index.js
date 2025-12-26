// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import connectDB from "./database/db.js";
// import userRoute from "./routes/user.route.js";
// import "./models/course.model.js"; // Import Course model to register it
// import courseRoute from "./routes/course.route.js";
// import mediaRoute from "./routes/media.route.js";
// import purchaseRoute from "./routes/purchaseCourse.route.js" 



// dotenv.config({});

// //call database connection
// connectDB();

// const app=express();
// const port=process.env.PORT || 8080;
// //default middleware
// app.get("/", (req,res) => {
//   res.send("Backend is running...");
// });

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: [
//         "http://localhost:5173",  // Local development
//         "https://e-learning-frontend-9h3q.onrender.com"  // Production frontend URL
//     ],
//     credentials: true,
// }));

// //apis
// app.use("/api/v1/media",mediaRoute);
// app.use("/api/v1/user",userRoute);
// app.use("/api/v1/course",courseRoute);
// app.use("/api/v1/purchase",purchaseRoute);

// // Health check endpoint
// app.get('/api/v1/health', (req, res) => {
//     res.status(200).json({ 
//         status: 'ok',
//         timestamp: new Date().toISOString(),
//         environment: process.env.NODE_ENV || 'development',
//         database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something went wrong!' });
// });

// // Home route
// app.get("/Home", (_,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"Welcome to home page and this is coming from backend"
//     })  
// });

// // Start the server
// const server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

/**
 * Razorpay webhook MUST be before express.json()
 */
app.use(
  "/api/v1/purchase/webhook",
  express.raw({ type: "application/json" })
);

// =====================
// MIDDLEWARES
// =====================
app.use(express.json());
app.use(cookieParser());

// 🔥🔥🔥 FIXED CORS 🔥🔥🔥
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-learning-management-system-a0dk.onrender.com", // ✅ REAL FRONTEND
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =====================
// ROUTES
// =====================
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);

// =====================
// HEALTH CHECK
// =====================
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// =====================
// ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
