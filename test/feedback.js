function getFeedback(guess, answer) {
  if (!guess || !answer) return [];

  const g = guess.trim().toUpperCase().split('');
  const a = answer.trim().toUpperCase().split('');

  const result = Array(g.length).fill(null);
  const used = Array(a.length).fill(false);

  // correct
  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      result[i] = { letter: g[i], result: 'correct' };
      used[i] = true;
    }
  }

  // misplaced/incorrect
  for (let i = 0; i < g.length; i++) {
    if (result[i]) continue;

    let found = false;

    for (let j = 0; j < a.length; j++) {
      if (!used[j] && g[i] === a[j]) {
        used[j] = true;
        found = true;
        break;
      }
    }

    result[i] = {
      letter: g[i],
      result: found ? 'misplaced' : 'incorrect'
    };
  }

  return result;
}

module.exports = getFeedback;