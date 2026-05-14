let state = {
    currentWord: null,
    startTime: null,
    attempts: 0,
    maxGuesses: 6,
    wordLength: 5
};

function resetGame(word) {
    state.currentWord = word;
    state.startTime = Date.now();
    state.attempts = 0;
}

module.exports = { state, resetGame };