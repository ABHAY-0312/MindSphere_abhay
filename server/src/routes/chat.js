import express from 'express';
import Course from '../models/Course.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateChatResponse } from '../services/geminiService.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/chat - Send message and get AI response
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }
    
    // Get user's courses for context
    const courses = await Course.find({ user: req.userId })
      .select('title summary topics')
      .limit(10);
    
    const coursesContext = courses.map(course => ({
      title: course.title,
      summary: course.summary,
      topics: course.topics
    }));
    
    // Generate AI response with a safe fallback so the chat UI does not hard-fail.
    let reply;
    try {
      reply = await generateChatResponse(message, coursesContext);
    } catch (aiError) {
      console.error('Chat AI provider error:', aiError);
      const personalizedHint = courses.length > 0
        ? `I couldn't reach the AI service right now, but I can still help. Try asking about one of your courses: ${courses.slice(0, 3).map(c => c.title).join(', ')}.`
        : `I couldn't reach the AI service right now. Try again in a moment, or ask me to create a study plan and I'll provide a structured template.`;
      reply = personalizedHint;
    }
    
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate response. Please try again.' 
    });
  }
});

export default router;
 
