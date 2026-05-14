"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
function addHighscore(data) {
    return new Promise((resolve, reject) => {
        const stmt = `
      INSERT INTO highscores (name, time, guesses, length)
      VALUES (?, ?, ?, ?)
    `;
        database_1.default.run(stmt, [data.name, data.time, data.guesses, data.length], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}
function getHighscores(length) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM highscores`;
        const params = [];
        if (length) {
            sql += ` WHERE length = ?`;
            params.push(length);
        }
        sql += ` ORDER BY time ASC`;
        database_1.default.all(sql, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}
exports.default = {
    addHighscore,
    getHighscores
};
