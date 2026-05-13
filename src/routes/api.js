// src/routes/api.js
const express = require('express');
const router = express.Router();
const getFeedback = require('../feedback');
const words = require('../data/swedishWords');
const db = require('../database');

let currentWord = null;
let startTime = null;
const maxGuesses = 6;

// ===== NEW GAME =====
router.post('/new-game', (req, res) => {
  const { length } = req.body;

  if (!words || words.length === 0) {
    return res.status(500).json({ error: 'No words found' });
  }

  const wordLength = Number(length) || 5;

  const filtered = words.filter(
    w => w.length === wordLength
  );

  if (filtered.length === 0) {
    return res.status(400).json({
      error: `Inga ord hittades med längden ${wordLength}`
    });
  }

  currentWord =
    filtered[Math.floor(Math.random() * filtered.length)].toUpperCase();

  startTime = Date.now();

  console.log('NEW WORD:', currentWord);

  res.json({
    ok: true,
    length: currentWord.length
  });
});

// ===== GUESS =====
router.post('/guess', (req, res) => {
  if (!currentWord) {
    return res.status(400).json({
      error: 'Spelet har inte startat'
    });
  }

  const guess = (req.body.guess || '')
    .toUpperCase()
    .trim();

  const guessCount = Number(req.body.guessCount || 0);

  // Dynamiskt felmeddelande
  if (guess.length !== currentWord.length) {
    return res.status(400).json({
      error: `Ordet måste innehålla ${currentWord.length} bokstäver`
    });
  }

 
  const feedback = getFeedback(guess, currentWord);

  const isWin = guess === currentWord;

  const elapsedTime = Math.floor(
    (Date.now() - startTime) / 1000
  );

  const gameOver =
    !isWin && guessCount + 1 >= maxGuesses;

  res.json({
    feedback,
    isWin,
    time: elapsedTime,
    gameOver,
    currentWord: gameOver ? currentWord : undefined
  });
});

// ===== HIGH SCORE =====
router.post('/highscore', (req, res) => {
  const { name, time, guesses } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'No name provided'
    });
  }

  db.run(
    `INSERT INTO highscores (name, time, guesses)
     VALUES (?, ?, ?)`,
    [name, time, guesses],
    err => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({ ok: true });
    }
  );
});

module.exports = router;