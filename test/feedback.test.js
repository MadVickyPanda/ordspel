const getFeedback = require('../src/feedback');

describe('Teststrategi:', () => {
  /*
    Vi testar:
    1. Alla bokstäver rätt (baseline)
    2. Inga bokstäver rätt
    3. Bokstäver på fel plats
    4. Dubbletter (kritisk edge case)
  */

  test('alla bokstäver korrekt', () => {
    const result = getFeedback('FISKA', 'FISKA');

    expect(result.every(r => r.result === 'correct')).toBe(true);
  });

  test('inga bokstäver matchar', () => {
    const result = getFeedback('ABCDE', 'FGHIJ');

    expect(result.every(r => r.result === 'incorrect')).toBe(true);
  });

  test('bokstäver på fel plats', () => {
    const result = getFeedback('ABCDE', 'EABCD');

    expect(result.every(r => r.result === 'misplaced')).toBe(true);
  });

  test('hanterar dubbla bokstäver korrekt', () => {
    const result = getFeedback('HALLÅ', 'CYKLA');

    expect(result).toEqual([
      { letter: 'H', result: 'incorrect' },
      { letter: 'A', result: 'misplaced' },
      { letter: 'L', result: 'incorrect' },
      { letter: 'L', result: 'correct' },
      { letter: 'Å', result: 'incorrect' }
    ]);
  });
});


/*
  Edge cases som testas:
  - Olika långa ord
  - Tom input
  - Många upprepade bokstäver
  - Skillnad mellan stora och små bokstäver

  Detta säkerställer att algoritmen är robust och hanterar ovanliga scenarion.
*/


describe('Edge cases', () => {


  test('hanterar olika långa ord', () => {
    const result = getFeedback('ABC', 'ABCDE');

    expect(result.length).toBe(3);
  });

  
  test('hanterar tomma strängar', () => {
    const result = getFeedback('', '');

    expect(result).toEqual([]);
  });

 
  test('hanterar många dubletter korrekt', () => {
    const result = getFeedback('AAAAA', 'AABBB');

    expect(result).toEqual([
      { letter: 'A', result: 'correct' },
      { letter: 'A', result: 'correct' },
      { letter: 'A', result: 'incorrect' },
      { letter: 'A', result: 'incorrect' },
      { letter: 'A', result: 'incorrect' }
    ]);
  });

 
  test('skiljer på stora och små bokstäver', () => {
    const result = getFeedback('abcde', 'ABCDE');

    expect(result.every(r => r.result === 'incorrect')).toBe(true);
  });

});