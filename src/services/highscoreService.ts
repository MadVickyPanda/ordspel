import db from '../database';

type ScoreInput = {
    name: string;
    time: number;
    guesses: number;
    length: number;
};

function addHighscore(data: ScoreInput) {
    return new Promise((resolve, reject) => {
        const stmt = `
      INSERT INTO highscores (name, time, guesses, length)
      VALUES (?, ?, ?, ?)
    `;

        db.run(
            stmt,
            [data.name, data.time, data.guesses, data.length],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
}

function getHighscores(length?: number) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM highscores`;
        const params: any[] = [];

        if (length) {
            sql += ` WHERE length = ?`;
            params.push(length);
        }

        sql += ` ORDER BY time ASC`;

        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export default {
    addHighscore,
    getHighscores
};