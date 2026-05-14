import words from '../data/swedishWords';
import getFeedback from '../feedback';
import { randomUUID } from 'crypto';

// TYPES
type Game = {
  gameId: string;
  word: string;
  guesses: number;
  maxGuesses: number;
  startTime: number;
  length: number;
  unique: boolean;
  finished: boolean;
};

// IN-MEMORY STORE
const games = new Map<string, Game>();

// START GAME
function startGame(length: number, unique: boolean) {
  const filtered = words.filter(
    (w) => w.length === Number(length)
  );

  const word = filtered[Math.floor(Math.random() * filtered.length)];
  const gameId = randomUUID();

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
function guess(gameId: string, guessWord: string) {
  const game = games.get(gameId);

  if (!game) {
    return { error: 'Invalid gameId' };
  }

  if (game.finished) {
    return { error: 'Game already finished' };
  }

  const cleanGuess = guessWord.toUpperCase();
  const answer = game.word.toUpperCase();

  const feedback = getFeedback(cleanGuess, answer);

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
export default {
  startGame,
  guess
}; 