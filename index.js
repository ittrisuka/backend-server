
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");

const app = express();

// ✅ Render apna port deta hai, fallback 5000 for local
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: ["https://trisdhagroup.com", "https://www.trisdhagroup.com"],
  methods: ["GET", "POST", "OPTIONS"], // include OPTIONS for preflight
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests for all routes
app.options("*", cors());

// ✅ Parse incoming JSON
app.use(express.json());


// ✅ MongoDB Connect (Render ke env se MONGO_URI lega)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connected successfully"))
  .catch((err) => console.error("🔴 MongoDB connection failed:", err));

// ✅ Schema for Contact Form
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("message", contactSchema);

// ✅ SendGrid Setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render 🚀");
});

// ✅ Contact Form Route
app.post("/contact", async (req, res) => {
  console.log("📩 Received form data:", req.body);
  const { name, email, message } = req.body;

  try {
    // ✅ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ✅ Send Email via SendGrid
    const msg = {
      to: "it@trisuka.com",  // receiver
      from: "it@trisuka.com", // verified sender in SendGrid
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully to it@trisuka.com");

    res.status(200).json({ success: true, msg: "Form submitted and email sent" });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    res.status(500).json({ success: false, msg: "Email send failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
