const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    user: String,
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: String,
    isCorrect: Boolean
});

module.exports = mongoose.model('Attempt', attemptSchema);
