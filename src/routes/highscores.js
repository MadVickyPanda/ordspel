const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.all(
    `SELECT * FROM highscores ORDER BY time ASC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).send('DB error');

      res.render('highscores', { scores: rows });
    }
  );
});

module.exports = router;