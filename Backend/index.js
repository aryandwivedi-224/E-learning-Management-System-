import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import "./models/course.model.js"; // Import Course model to register it
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";

dotenv.config({});

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",  // Local development
        "https://e-learning-frontend-9h3q.onrender.com"  // Production frontend URL
    ],
    credentials: true,
}));

// Database connection logging
mongoose.connection.on('connecting', () => {
    console.log('🔄 Connecting to MongoDB...');});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Port: ${mongoose.connection.port}`);
    console.log(`   - Database: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    if (process.env.NODE_ENV === 'production') {
        console.error('   - Make sure your MongoDB Atlas IP whitelist includes Render\'s IP addresses');
        console.error('   - Check your MONGODB_URI in the environment variables');
    }
});

mongoose.connection.on('disconnected', () => {
    console.log('ℹ️ MongoDB disconnected');
});

// Call database connection
connectDB().catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
});

// Simple test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Test endpoint works!',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version
    });
});

// Health check endpoint with detailed info
app.get('/api/v1/health', (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const dbStatusText = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        }[dbStatus] || 'unknown';

        res.status(200).json({ 
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: dbStatusText,
                readyState: dbStatus,
                name: mongoose.connection.name,
                host: mongoose.connection.host
            },
            node: {
                version: process.version,
                platform: process.platform,
                memory: process.memoryUsage(),
                uptime: process.uptime()
            }
        });
    } catch (error) {
        console.error('Health check failed:', error);
        next(error);
    }
});

// API routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);

// Home route
app.get("/Home", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the E-Learning Management System API",
        timestamp: new Date().toISOString(),
        documentation: "https://github.com/yourusername/e-learning-system#api-documentation"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    res.status(err.status || 500).json({
        success: false,
        error: err.name || 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        timestamp: new Date().toISOString()
    });
});

// Start the server
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🕒 Server started at: ${new Date().toISOString()}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
