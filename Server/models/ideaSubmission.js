import mongoose from "mongoose";
import validator from "validator";

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    media: [{ type: String, required: true }], // Array for images/videos
    problemStatement: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    technology: { type: [String] }, // Array of technologies
    referenceLinks: {
      type: [String],
      validate: {
        validator: function (links) {
          return links.every(link => /^https?:\/\/.+$/.test(link));
        },
        message: "One or more reference links are invalid URLs."
      }
    },
    approved: { type: Boolean, default: false },
    feasibilityScore: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    aiSuggestions: { type: String },
    userObject: { type: String, required: true },
    
    // Crowdfunding fields
    fundingGoal: { type: Number, default: 100 },
    currentFunding: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Idea || mongoose.model("Idea", IdeaSchema);
