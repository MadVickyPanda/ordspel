// public/app.js
const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [guess, setGuess] = React.useState('');
  const [guesses, setGuesses] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [guessCount, setGuessCount] = React.useState(0);
  const [wordLength, setWordLength] = React.useState(5);

  const maxRows = 6;

  React.useEffect(() => {
    startGame(wordLength);
  }, []);

  // ===== START GAME =====
  async function startGame(length = wordLength) {
    const res = await fetch('/api/new-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ length })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Kunde inte starta spelet');
      return;
    }

    setGuess('');
    setGuesses([]);
    setGuessCount(0);
    setMessage(`Gissa ordet (${length} bokstäver)!`);
  }

  // ===== CHANGE WORD LENGTH =====
  async function changeWordLength(length) {
    setWordLength(length);
    await startGame(length);
  }

  // ===== SEND GUESS =====
  async function sendGuess() {
    if (!guess) return;

    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guess,
        guessCount
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || 'Fel vid gissning');
      return;
    }

    const next = guessCount + 1;

    setGuessCount(next);

    setGuesses(prev => [
      ...prev,
      {
        word: guess,
        feedback: data.feedback
      }
    ]);

    if (data.isWin) {
      const name = prompt('🎉 Du vann! Skriv ditt namn:');

      if (name) {
        await fetch('/api/highscore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            time: next,
            guesses: next
          })
        });
      }

      setMessage('🏆 Rätt ord!');
    }
    else if (data.gameOver) {
      setMessage(`💀 Game Over! Rätt ord: ${data.currentWord}`);
    }
    else {
      setMessage('Fortsätt gissa!');
    }

    setGuess('');
  }

  // ===== ENTER KEY =====
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendGuess();
    }
  }

  // ===== GRID =====
  const grid = [];

  for (let i = 0; i < maxRows; i++) {
    const row = guesses[i];
    const cells = [];

    for (let j = 0; j < wordLength; j++) {
      const cell = row?.feedback?.[j];
      const letter = row?.word?.[j] || '';

      let bg = '#121213';

      if (cell?.result === 'correct') {
        bg = '#538d4e';
      }
      else if (cell?.result === 'misplaced') {
        bg = '#b59f3b';
      }
      else if (cell) {
        bg = '#3a3a3c';
      }

      cells.push(
        React.createElement(
          'div',
          {
            key: `${i}-${j}`,
            className: 'cell',
            style: { background: bg }
          },
          letter
        )
      );
    }

    grid.push(
      React.createElement(
        'div',
        {
          key: i,
          className: 'row'
        },
        cells
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'page' },

    // ===== NAV =====
    React.createElement(
      'div',
      {
        className: 'nav',
        key: 'nav'
      },
      [
        React.createElement(
          'button',
          {
            key: 'home',
            onClick: () => location.href = '/'
          },
          'Spel'
        ),

        React.createElement(
          'button',
          {
            key: 'about',
            onClick: () => location.href = '/about'
          },
          'Om'
        ),

        React.createElement(
          'button',
          {
            key: 'score',
            onClick: () => location.href = '/highscores'
          },
          'Highscores'
        ),

        React.createElement(
          'button',
          {
            key: 'restart',
            onClick: () => startGame(wordLength)
          },
          'Nytt spel'
        )
      ]
    ),

    // ===== TITLE =====
    React.createElement(
      'h1',
      { key: 'title' },
      'WORDLE'
    ),

    // ===== SELECT =====
    React.createElement(
      'div',
      { key: 'select' },

      React.createElement(
        'select',
        {
          value: wordLength,
          onChange: e =>
            changeWordLength(Number(e.target.value))
        },

        [3, 4, 5, 6, 7, 8].map(n =>
          React.createElement(
            'option',
            {
              key: n,
              value: n
            },
            `${n} bokstäver`
          )
        )
      )
    ),

    // ===== GRID =====
    React.createElement(
      'div',
      { key: 'grid' },
      grid
    ),

    // ===== INPUT =====
    React.createElement(
      'div',
      {
        key: 'input',
        className: 'inputRow'
      },
      [
        React.createElement(
          'input',
          {
            key: 'inputField',
            value: guess,
            maxLength: wordLength,
            onKeyDown: handleKeyDown,
            onChange: e =>
              setGuess(
                e.target.value.toUpperCase()
              )
          }
        ),

        React.createElement(
          'button',
          {
            key: 'submit',
            onClick: sendGuess
          },
          'Enter'
        )
      ]
    ),

    // ===== MESSAGE =====
    React.createElement(
      'p',
      { key: 'msg' },
      message
    )
  );
}

root.render(
  React.createElement(App)
);