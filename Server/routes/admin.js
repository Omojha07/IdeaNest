import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import Idea from "../models/ideaSubmission.js"; // Your Idea model
import User from "../models/User.js"; // Your User model (if you have one)

const router = express.Router();

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(401).json({ message: "User ID is required" });
  }

  try {
    // Fetch the user from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (user?.unsafeMetadata?.role === "admin") {
      next(); // Proceed if the user is an admin
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    console.error("Error verifying admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin route to fetch all data (only accessible by admins)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const ideas = await Idea.find();
    const users = await User.find(); // Replace with your user model
    res.status(200).json({ ideas, users });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
