// models/donation.js
import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
  user: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Donation", DonationSchema);
