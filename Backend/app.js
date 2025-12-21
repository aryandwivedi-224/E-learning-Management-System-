import paymentRoutes from "./routes/payment.route.js";
 
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/payment", paymentRoutes); 