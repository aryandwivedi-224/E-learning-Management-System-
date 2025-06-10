import Razorpay from "razorpay";
import crypto from "crypto";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount: course.coursePrice * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${courseId}_${userId}`,
      notes: {
        courseId: courseId,
        userId: userId,
      },
    });

    if (!order.id) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating order" });
    }

    // Save the purchase record
    newPurchase.paymentId = order.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // Publishable key for frontend
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const purchase = await CoursePurchase.findOne({
      paymentId: razorpay_order_id,
    }).populate({ path: "courseId" });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    purchase.status = "completed";
    purchase.paymentId = razorpay_payment_id;

    // Make all lectures visible by setting `isPreviewFree` to true
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    await purchase.save();

    // Update user's enrolledCourses
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
    const razorpaySignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
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
