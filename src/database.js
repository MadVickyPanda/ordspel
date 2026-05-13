const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./highscores.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS highscores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      time INTEGER,
      guesses INTEGER
    )
  `);
});

module.exports = db;