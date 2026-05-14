const getFeedback = require('../src/feedback');

test('all correct letters', () => {
  const result = getFeedback('CAT', 'CAT');

  expect(result.every(r => r.result === 'correct')).toBe(true);
});

test('misplaced letter', () => {
  const result = getFeedback('ABC', 'CAB');

  expect(result.some(r => r.result === 'misplaced')).toBe(true);
});