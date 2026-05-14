"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameService_1 = __importDefault(require("../services/gameService"));
const database_1 = __importDefault(require("../database"));
const router = express_1.default.Router();
// NEW GAME
router.post('/new-game', (req, res) => {
    try {
        const { length, unique } = req.body;
        const game = gameService_1.default.startGame(length, unique);
        res.status(200).json(game);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to start game' });
    }
});
// GUESS
router.post('/guess', (req, res) => {
    try {
        const { gameId, guess } = req.body;
        if (!gameId || !guess) {
            return res.status(400).json({ error: 'Missing gameId or guess' });
        }
        const result = gameService_1.default.guess(gameId, guess);
        if ('error' in result) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json(result);
    }
    catch (err) {
        console.error('GUESS ERROR:', err);
        return res.status(500).json({ error: 'Guess failed' });
    }
});
// HIGHSCORE
router.post('/highscore', (req, res) => {
    try {
        const { name, time, guesses, length } = req.body;
        database_1.default.run(`INSERT INTO highscores (name, time, guesses, length)
       VALUES (?, ?, ?, ?)`, [name, time, guesses, length], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'DB error' });
            }
            res.json({ success: true });
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
