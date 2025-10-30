/*const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Connect = require("./models/Contact");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connect
mongoose.connect(
  "mongodb+srv://seo:RhEus1bMtkZhsEnk@trisdhacluster.gsgzlnz.mongodb.net/?retryWrites=true&w=majority&appName=TrisdhaCluster"
).then(() => {
  console.log("🟢 MongoDB connected successfully");
}).catch((err) => {
  console.error("🔴 MongoDB connection failed:", err);
});

// ✅ Schema for Contact Form
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model("message", contactSchema); // "message" is collection name

// ✅ Email Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "it@trisuka.com", // ✅ apna Gmail
    pass: "llbc wsya xjjm qgag" // ✅ App Password (without space)
  }
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/contact", async (req, res) => {

  // 🟡 Ye line add karo:
  console.log("📩 Received form data:", req.body);
  

  try {

    const { name, email, message } = req.body;
    // ✅ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ✅ Send Email
    const mailOptions = {
      from: "it@trisuka.com",
      to: "it@trisuka.com", // 👈 yahaan bhi wahi email daalo
      subject: "New Contact Form Submission",*/


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

// ✅ Render apna port deta hai, fallback 5000 for local
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: ["https://trisdhagroup.com", "https://www.trisdhagroup.com"], // allowed frontend domains
  methods: ["GET", "POST"],
  credentials: true
}));
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

// ✅ Email Setup using environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Render 🚀");
});

app.post("/contact", async (req, res) => {
  console.log("📩 Received form data:", req.body);

  try {
    const { name, email, message } = req.body;

    // ✅ Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // ✅ Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // dono same email
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res.status(500).json({ success: false, msg: "Email send failed" });
      } else {
        console.log("✅ Email sent:", info.response);
        return res.status(200).json({ success: true, msg: "Form submitted and email sent" });
      }
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});