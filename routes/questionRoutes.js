const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Add a question
router.post('/questions', async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const newQuestion = new Question({ question, options, correctAnswer });
    await newQuestion.save();
    res.json({ message: 'Question added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Submit answer
router.post('/submit', async (req, res) => {
  try {
    const { questionId, selectedOption } = req.body;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = question.correctAnswer === selectedOption;
    res.json({ correct: isCorrect });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

module.exports = router;
