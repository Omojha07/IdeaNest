import express from 'express'
import Idea from '../models/ideaSubmission.js'
import upload from '../middleware/multer.js'
import analyzeIdea from "../services/geminiService.js";

const router = express.Router()

router.post('/', upload.array('media', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No media files uploaded' })
    }

    const {
      title,
      description,
      problemStatement,
      category,
      technology,
      referenceLinks,
      userObject
    } = req.body

    if (
      !title ||
      !description ||
      !problemStatement ||
      !category 
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' })
    }

    const mediaUrls = req.files.map(file => file.path)

    const newIdea = new Idea({
      title,
      media: mediaUrls,
      description,
      category,
      problemStatement,
      technology: technology.split(','),
      referenceLinks,
      userObject
    })

    await newIdea.save()

    // Call AI Feasibility Analysis
  const aiAnalysis = await analyzeIdea(newIdea);

  // Update DB with AI response
  newIdea.aiSuggestions = aiAnalysis;
  await newIdea.save();
  
    res
      .status(201)
      .json({ success: true, message: 'Idea submitted successfully', newIdea })
  } catch (error) {
    console.error('Error submitting idea:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting idea',
      error: error.message
    })
  }
})


// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find({ approved: false })
    res.json({ success: true, ideas })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// Fetch Single Idea by ID
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' })
    }
    res.json({ success: true, idea })
  } catch (error) {
    console.error('Error fetching idea:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

router.put('/:id/approve', async (req, res) => {
  try {
    const ideaId = req.params.id
    const idea = await Idea.findById(ideaId)

    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' })
    }

    idea.approved = true
    await idea.save()

    res.json({ success: true, message: 'Idea approved and moved to projects!' })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error approving idea', error })
  }
})

export default router
