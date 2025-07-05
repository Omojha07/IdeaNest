import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { requireAuth } from '@clerk/express';
import userRoutes from './routes/userRoutes.js';
import ideaRoutes from './routes/ideas.js';
import chatRouter from "./routes/chatRoutes.js";
import projectRouter from './routes/projects.js'
import adminRouter from './routes/admin.js'

// Import your models (adjust the paths based on your project structure)
import User from './models/User.js';
import ChatMessage from './models/ChatMessage.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/ideas', ideaRoutes);
app.use("/api/chat", requireAuth(), chatRouter);
app.use('/api/projects', projectRouter)
app.use('/api/admin', adminRouter)

// Create the HTTP server from the Express app
const server = createServer(app);

// Initialize Socket.io with the HTTP server and proper CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Socket.io connection and event handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('chat message', async (msg) => {
    try {
      // Look up the user using the clerkId from the message
      const userRecord = await User.findOne({ clerkId: msg.senderId });
      if (!userRecord) {
        throw new Error('User not found for clerk id: ' + msg.senderId);
      }

      // Create and save a new chat message
      const chatMsg = new ChatMessage({
        sender: userRecord._id,
        message: msg.message,
      });
      await chatMsg.save();

      // Populate the sender field (adjust as needed for your schema)
      const populatedMsg = await chatMsg.populate('sender', 'name avatar');
      // Emit the chat message to all connected clients
      io.emit('chat message', populatedMsg);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});