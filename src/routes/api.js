const express = require('express');
const router = express.Router();

const getFeedback = require('../feedback');
const words = require('../data/swedishWords');

let currentWord = null;
let startTime = null;

// ===== NEW GAME =====
router.post('/new-game', (req, res) => {
  const { length } = req.body;

  if (!words || words.length === 0) {
    return res.status(500).json({ error: 'No words found' });
  }

  // ===== FILTER PÅ LÄNGD =====
  let filtered = words;

  if (length) {
    filtered = words.filter(w => w.length === Number(length));
  }

  if (filtered.length === 0) {
    return res.status(400).json({
      error: `No words found for length ${length}`
    });
  }

  currentWord = filtered[Math.floor(Math.random() * filtered.length)];

  console.log("NEW WORD:", currentWord);

  res.json({
    ok: true,
    length: currentWord.length
  });
});

// ===== DEBUG =====
router.get('/debug-word', (req, res) => {
  res.json({ currentWord });
});

// ===== GUESS =====
router.post('/guess', (req, res) => {
  if (!currentWord) {
    return res.status(400).json({ error: 'Game not started' });
  }

  const guess = (req.body.guess || '').toUpperCase().trim();

  // ❌ NYTT: längdkontroll
  if (guess.length !== currentWord.length) {
    return res.status(400).json({
      error: `Ordet måste vara ${currentWord.length} bokstäver långt`
    });
  }

  const feedback = getFeedback(guess, currentWord);
  const isWin = guess === currentWord;

  console.log("GUESS:", guess, "WORD:", currentWord);

  res.json({
    feedback,
    isWin
  });
});
// ===== HIGH SCORE =====
const db = require('../database');

router.post('/highscore', (req, res) => {
  const { name, time, guesses } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'No name provided' });
  }

  db.run(
    `INSERT INTO highscores (name, time, guesses) VALUES (?, ?, ?)`,
    [name, time, guesses],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ ok: true });
    }
  );
});

module.exports = router;