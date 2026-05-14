import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./highscores.db');

// CREATE TABLE
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS highscores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      time INTEGER NOT NULL,
      guesses INTEGER NOT NULL,
      length INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;