import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import { sendVerificationEmail } from "../emailVerify/verifyEmail.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";

/* =========================
   REGISTER USER
========================= */
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Split name logic
    let fName = name ? name.split(" ")[0] : "";
    let lName = name ? name.split(" ").slice(1).join(" ") : "";

    if (!fName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName: fName,
      lastName: lName,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    try {
      await sendVerificationEmail(token, email);

      newUser.token = token;
      await newUser.save();

      return res.status(201).json({ success: true, message: "Verification email sent!" });
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error) {
    console.error("General Register Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   VERIFY EMAIL
========================= */
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ success: false, message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.token = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   RESEND VERIFICATION EMAIL
========================= */
export const reVerify = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    await sendVerificationEmail(token, email);

    user.token = token;
    await user.save();

    return res.status(200).json({ success: true, message: "Verification email sent again" });
  } catch {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* =========================
   LOGIN USER
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.firstName}!`,
      accessToken,
      token: accessToken, // alias for frontend compatibility
      user: {
        id: user._id,
        _id: user._id,
        email: user.email,
        name: `${user.firstName}${user.lastName ? " " + user.lastName : ""}`,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* =========================
   LOGOUT USER
========================= */
export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await Session.deleteMany({ UserId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Fixed: Math.random() (was Math.randon())
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    // Fixed: otpExpiry (was otpEspiry)
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendOTPMail(otp, email);

    return res.status(200).json({ success: true, message: "OTP sent to email successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP not generated or already verified" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired, please request a new one" });
    }

    if (String(otp) !== String(user.otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Both password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   ALL USERS (Admin)
========================= */
export const allUser = async (req, res) => {
  try {
    // Fixed: was useTransition.find() — now correct User.find()
    const users = await User.find().select("-password -otp -otpExpiry -token");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET USER BY ID
========================= */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Fixed: was ".select("password -otp -otpExpiry -token")" — 'password' needs a minus sign
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};