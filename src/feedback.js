function getFeedback(guess, answer) {
  const result = [];
  const answerLetters = answer.toUpperCase().split('');
  const guessLetters = guess.toUpperCase().split('');

  const taken = Array(answerLetters.length).fill(false);

  // correct
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = { letter: guessLetters[i], result: 'correct' };
      taken[i] = true;
    } else {
      result[i] = null;
    }
  }

  // misplaced / incorrect
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