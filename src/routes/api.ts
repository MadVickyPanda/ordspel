import express from 'express';
import gameService from '../services/gameService';
import db from '../database';

const router = express.Router();

// NEW GAME
router.post('/new-game', (req, res) => {
    try {
        const { length, unique } = req.body;

        const game = gameService.startGame(length, unique);

        res.status(200).json(game);
    } catch (err) {
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

        const result = gameService.guess(gameId, guess);

        if ('error' in result) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error('GUESS ERROR:', err);
        return res.status(500).json({ error: 'Guess failed' });
    }
});

// HIGHSCORE
router.post('/highscore', (req, res) => {
    try {
        const { name, time, guesses, length } = req.body;

        db.run(
            `INSERT INTO highscores (name, time, guesses, length)
       VALUES (?, ?, ?, ?)`,
            [name, time, guesses, length],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'DB error' });
                }

                res.json({ success: true });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;