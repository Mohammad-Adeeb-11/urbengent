import Otp from "../models/Otp.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// SEND OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your UrbanGent OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  res.json({ message: "OTP sent successfully" });
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name: email, email, password: "otp-login" });
  }

  await Otp.deleteMany({ email });

  res.json({
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};
