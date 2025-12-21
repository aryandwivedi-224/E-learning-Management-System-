import express from "express";
import { createPaymentIntent, confirmPayment } from "../utils/stripe.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create-payment-intent", isAuthenticated, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required"
            });
        }

        const { clientSecret, paymentIntentId } = await createPaymentIntent(amount);

        res.status(200).json({
            success: true,
            clientSecret,
            paymentIntentId
        });
    } catch (error) {
        console.error("Payment intent creation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment intent"
        });
    }
});

router.post("/confirm-payment", isAuthenticated, async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        
        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment intent ID is required"
            });
        }

        const paymentIntent = await confirmPayment(paymentIntentId);

        res.status(200).json({
            success: true,
            paymentIntent
        });
    } catch (error) {
        console.error("Payment confirmation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to confirm payment"
        });
    }
});

export default router; 