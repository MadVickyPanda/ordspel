const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const db = require('./database');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// STATE
app.locals.currentWord = null;

// API
app.use('/api', require('./routes/api'));

// STARTSIDA (spel)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ABOUT (KRAV)
app.get('/about', (req, res) => {
  res.render('about');
});

// HIGHSCORES (SSR KRAV)
app.get('/highscores', (req, res) => {
  db.all('SELECT * FROM highscores ORDER BY time ASC', [], (err, rows) => {
    if (err) return res.send('DB error');
    res.render('highscores', { scores: rows });
  });
});

// START
app.listen(5080, () => {
  console.log('http://localhost:5080');
});