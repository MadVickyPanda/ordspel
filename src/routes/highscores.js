const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const length = req.query.length;

  let sql = 'SELECT * FROM highscores';
  let params = [];

  if (length) {
    sql += ' WHERE length = ?';
    params.push(length);
  }

  sql += ' ORDER BY time ASC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).send('DB error');

    res.render('highscores', {
      scores: rows,
      selectedLength: length
    });
  });
});

module.exports = router;