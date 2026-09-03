import "dotenv/config";
import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const smtpTransport =
  process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

const sendWithResend = async (email, otp) => {
  if (!resend) {
    throw new Error("Resend is not configured");
  }

  const emailResponse = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Your UrbanGent OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  if (emailResponse.error) {
    throw new Error(emailResponse.error.message || "Resend email failed");
  }

  return true;
};

const sendWithSmtp = async (email, otp) => {
  if (!smtpTransport) {
    throw new Error("SMTP transport is not configured");
  }

  const info = await smtpTransport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your UrbanGent OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  if (!info.accepted || info.accepted.length === 0) {
    throw new Error("SMTP email was not accepted by the provider");
  }

  return true;
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!resend && !smtpTransport) {
      return res.status(500).json({
        message:
          "Email service is not configured. Add RESEND_API_KEY or EMAIL_HOST/EMAIL_USER/EMAIL_PASS.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    try {
      if (resend) {
        await sendWithResend(email, otp);
      } else {
        await sendWithSmtp(email, otp);
      }
    } catch (serviceError) {
      console.warn(
        "Primary email provider failed, trying fallback provider:",
        serviceError.message,
      );

      if (resend && smtpTransport) {
        await sendWithSmtp(email, otp);
      } else {
        throw serviceError;
      }
    }

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP email send failed:", error);
    return res.status(500).json({
      message:
        error.message || "Failed to send OTP email. Please try again later.",
    });
  }
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
