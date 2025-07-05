import express from "express";
import Idea from "../models/IdeaSubmission.js";
import Donation from "../models/donation.js";
import InvestorInterest from "../models/InvestorInterest.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const projects = await Idea.find({ approved: true });
    res.json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Idea.findOne({ _id: id, approved: true });
    if (project) {
      res.json({ success: true, project });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/:id/fund", async (req, res) => {
  const projectId = req.params.id;
  const { userId, amount } = req.body;
  console.log(userId, amount)
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid donation amount" });
  }

  try {
    // Create a new donation record
    const donation = await Donation.create({
      idea: projectId,
      user: userId,
      amount,
      date: new Date()
    });

    // Update the project's current funding using atomic $inc operation
    await Idea.findByIdAndUpdate(projectId, { $inc: { currentFunding: amount } });

    res.json({ success: true, message: "Donation successful", donation });
  } catch (error) {
    console.error("Error processing donation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Investor Interest: Express interest in a project
router.post("/:id/invest", async (req, res) => {
  const projectId = req.params.id;
  const { investorId, message } = req.body;

  try {
    const interest = await InvestorInterest.create({
      idea: projectId,
      investor: investorId,
      message,
      date: new Date()
    });
    res.json({ success: true, message: "Investor interest recorded", interest });
  } catch (error) {
    console.error("Error recording investor interest:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
