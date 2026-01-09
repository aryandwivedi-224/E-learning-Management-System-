import express from "express";
import { login, signup, logout } from "../controllers/auth.controller.js";
import { validateLogin, validateSignup } from "../middlewares/validation.middleware.js";

const router = express.Router();

// Auth routes with validation
router.post("/login", validateLogin, login);
router.post("/signup", validateSignup, signup);
router.get("/logout", logout);

export default router; 