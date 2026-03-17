function getFeedback(guess, answer) {
  const result = [];
  const answerLetters = answer.split('');
  const guessLetters = guess.split('');

  // Steg 1: markera correct
  const taken = Array(answer.length).fill(false);

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = { letter: guessLetters[i], result: 'correct' };
      taken[i] = true;
    } else {
      result[i] = null;
    }
  }

  // Steg 2: markera misplaced / incorrect
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i]) continue;

    let found = false;

    for (let j = 0; j < answerLetters.length; j++) {
      if (!taken[j] && guessLetters[i] === answerLetters[j]) {
        found = true;
        taken[j] = true;
        break;
      }
    }

    result[i] = {
      letter: guessLetters[i],
      result: found ? 'misplaced' : 'incorrect'
    };
  }

  return result;
}

module.exports = getFeedback;