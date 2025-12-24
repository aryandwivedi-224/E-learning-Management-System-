import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

// Initialize Razorpay only if keys are present
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized successfully');
  } else {
    console.warn('Razorpay keys not found. Payment functionality will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
  console.warn('Payment functionality will be disabled.');
}

export const createCheckoutSession = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment service is currently unavailable. Please try again later."
      });
    }

    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const purchase = await CoursePurchase.create({
      userId,
      courseId,
      amount: course.coursePrice,
      status: "pending",
    });

    try {
      // Create a Razorpay order
      const order = await razorpay.orders.create({
        amount: course.coursePrice * 100, // Amount in paise
        currency: "INR",
        receipt: `receipt_${courseId}_${userId}`,
        notes: {
          purchaseId: purchase._id.toString(),
          userId: userId,
          courseId: courseId,
        },
      });

      // Update purchase with order ID
      purchase.orderId = order.id;
      await purchase.save();

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID, // Publishable key for frontend
      });
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to create payment order. Please try again."
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment verification service is currently unavailable. Please contact support."
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required payment details" 
      });
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.warn('Invalid payment signature received');
      return res.status(400).json({ 
        success: false,
        message: "Invalid payment signature" 
      });
    }

    const purchase = await CoursePurchase.findOne({
      orderId: razorpay_order_id,
    }).populate({ path: "courseId" });

    if (!purchase) {
      console.warn(`Purchase not found for order ID: ${razorpay_order_id}`);
      return res.status(404).json({ 
        success: false,
        message: "Purchase not found" 
      });
    }

    // Update purchase status
    purchase.status = "completed";
    purchase.paymentId = razorpay_payment_id;
    purchase.paymentDate = new Date();
    
    await purchase.save();

    try {
      // Add course to user's enrolled courses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { courses: purchase.courseId._id } },
        { new: true }
      );
    } catch (userUpdateError) {
      console.error('Failed to update user courses:', userUpdateError);
      // Continue even if user update fails, as the payment is already verified
    }
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    // Update course to add user ID to enrolledStudents
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log('Error in getCourseDetailWithPurchaseStatus:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleWebhook = async (req, res) => {
  try {
    if (!razorpay) {
      console.error('Razorpay not initialized - webhook received but cannot process');
      return res.status(503).json({ 
        success: false, 
        message: 'Payment service unavailable' 
      });
    }

    const razorpaySignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!razorpaySignature || !webhookSecret) {
      console.warn('Missing required webhook headers or configuration');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required headers or configuration' 
      });
    }

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    if (!body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Empty request body' 
      });
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (razorpaySignature !== expectedSignature) {
        console.warn('Invalid webhook signature received');
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid webhook signature' 
        });
      }
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing webhook' 
      });
    }

    const event = req.body;

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.payment.entity);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
};

// Helper functions for webhook events
const handlePaymentCaptured = async (payment) => {
  try {
    const purchase = await CoursePurchase.findOne({
      paymentId: payment.order_id
    }).populate({ path: 'courseId' });

    if (!purchase) return;

    purchase.status = 'completed';
    purchase.paymentId = payment.id;
    await purchase.save();

    // Update lectures
    if (purchase.courseId?.lectures?.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    // Update course's enrolledStudents
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    const purchase = await CoursePurchase.findOne({
      paymentId: payment.order_id
    });

    if (purchase) {
      purchase.status = 'failed';
      await purchase.save();
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

const handleOrderPaid = async (payment) => {
  await handlePaymentCaptured(payment);
};
