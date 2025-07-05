import User from "../models/User.js";
import Idea from "../models/ideaSubmission.js";
// import Project from "../models/Project.js";
// import Event from "../models/Event.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get all ideas
export const getAllIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ideas" });
  }
};

// // Get all projects
// export const getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.find();
//     res.json(projects);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching projects" });
//   }
// };

// // Create an event
// export const createEvent = async (req, res) => {
//   try {
//     const { name, date, description } = req.body;
//     const newEvent = new Event({ name, date, description });
//     await newEvent.save();
//     res.json({ message: "Event created successfully", event: newEvent });
//   } catch (error) {
//     res.status(500).json({ error: "Error creating event" });
//   }
// };
