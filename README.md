
# Ordspel – Inlämning 1: Testade algoritmer

## Beskrivning
Detta projekt implementerar Algoritm A för ett Wordle-inspirerat spel:  
- Funktionen `getFeedback(guess, answer)` ger feedback på spelarens gissning.  
- Den returnerar en array med objekt `{letter, result}` där `result` är `'correct'`, `'misplaced'` eller `'incorrect'`.

Exempel:  

```javascript
getFeedback('HALLÅ', 'CYKLA')
// Output:
[
  { letter: 'H', result: 'incorrect' },
  { letter: 'A', result: 'misplaced' },
  { letter: 'L', result: 'incorrect' },
  { letter: 'L', result: 'correct' },
  { letter: 'Å', result: 'incorrect' }
]