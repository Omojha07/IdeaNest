import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'mentor', 'admin'], default: 'user' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
