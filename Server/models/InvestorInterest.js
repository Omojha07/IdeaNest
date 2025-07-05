import mongoose from "mongoose";

const InvestorInterestSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("InvestorInterest", InvestorInterestSchema);
