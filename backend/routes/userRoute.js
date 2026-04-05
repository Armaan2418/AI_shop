import express from "express";

import {
  register,
  login,
  verify,
  reVerify,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUser,
  getUserById,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// ================= PUBLIC ROUTES =================
router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-verification", reVerify);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);

// ================= PROTECTED ROUTES =================
router.post("/logout", isAuthenticated, logout);
router.post("/change-password/:email", isAuthenticated, changePassword);
router.get("/all-user", isAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", getUserById);

export default router;