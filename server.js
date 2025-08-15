const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Attempt = require('./models/Attempt');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Health check
app.get('/health', (req, res) => {
    res.send('Backend is running');
});

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the Quiz API');
});

// API ROUTES
// Add a new question
app.post('/api/questions', async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.json({ message: 'Question added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all questions
app.get('/api/questions', async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
});

// Submit an answer
app.post('/api/attempt', async (req, res) => {
    const { user, questionId, selectedAnswer } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = question.correctAnswer === selectedAnswer;

    const attempt = new Attempt({
        user,
        questionId,
        selectedAnswer,
        isCorrect
    });
    await attempt.save();

    res.json({
        correct: isCorrect,
        correctAnswer: question.correctAnswer
    });
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
