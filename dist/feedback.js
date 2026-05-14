"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getFeedback;
function getFeedback(guess, answer) {
    guess = guess.toUpperCase();
    answer = answer.toUpperCase();
    const result = [];
    const used = Array(answer.length).fill(false);
    // ======================
    // GREEN PASS
    // ======================
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === answer[i]) {
            result[i] = {
                letter: guess[i],
                result: 'correct'
            };
            used[i] = true;
        }
        else {
            result[i] = {
                letter: guess[i],
                result: 'incorrect'
            };
        }
    }
    // ======================
    // YELLOW PASS
    // ======================
    for (let i = 0; i < guess.length; i++) {
        if (result[i].result === 'correct')
            continue;
        for (let j = 0; j < answer.length; j++) {
            if (!used[j] &&
                guess[i] === answer[j]) {
                result[i] = {
                    letter: guess[i],
                    result: 'misplaced'
                };
                used[j] = true;
                break;
            }
        }
    }
    return result;
}
