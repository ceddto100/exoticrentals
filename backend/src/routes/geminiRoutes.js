import express from 'express';
import { chatWithConcierge } from '../controllers/geminiController.js';

const router = express.Router();

// POST /api/gemini/chat - Chat with AI concierge
router.post('/chat', chatWithConcierge);

export default router;
