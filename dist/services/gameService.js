"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swedishWords_1 = __importDefault(require("../data/swedishWords"));
const feedback_1 = __importDefault(require("../feedback"));
const crypto_1 = require("crypto");
// IN-MEMORY STORE
const games = new Map();
// START GAME
function startGame(length, unique) {
    const filtered = swedishWords_1.default.filter((w) => w.length === Number(length));
    const word = filtered[Math.floor(Math.random() * filtered.length)];
    const gameId = (0, crypto_1.randomUUID)();
    games.set(gameId, {
        gameId,
        word,
        guesses: 0,
        maxGuesses: 6,
        startTime: Date.now(),
        length,
        unique,
        finished: false
    });
    return { gameId, length, unique };
}
// GUESS
function guess(gameId, guessWord) {
    const game = games.get(gameId);
    if (!game) {
        return { error: 'Invalid gameId' };
    }
    if (game.finished) {
        return { error: 'Game already finished' };
    }
    const cleanGuess = guessWord.toUpperCase();
    const answer = game.word.toUpperCase();
    const feedback = (0, feedback_1.default)(cleanGuess, answer);
    game.guesses++;
    const isWin = cleanGuess === answer;
    const gameOver = isWin || game.guesses >= game.maxGuesses;
    let time = 0;
    if (isWin) {
        game.finished = true;
        time = Date.now() - game.startTime;
    }
    if (gameOver) {
        game.finished = true;
    }
    return {
        gameId,
        feedback,
        isWin,
        gameOver,
        time,
        currentWord: gameOver ? game.word : undefined
    };
}
// EXPORT
exports.default = {
    startGame,
    guess
};
