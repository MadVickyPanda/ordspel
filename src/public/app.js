const root = ReactDOM.createRoot(document.getElementById('root'));

function Navbar({ active }) {
  return React.createElement(
    'div',
    { className: 'nav' },
    [
      React.createElement(
        'a',
        {
          key: 'game',
          href: '/',
          className: active === 'game' ? 'active' : ''
        },
        'Spel'
      ),
      React.createElement(
        'a',
        {
          key: 'about',
          href: '/about',
          className: active === 'about' ? 'active' : ''
        },
        'Om'
      ),
      React.createElement(
        'a',
        {
          key: 'highscores',
          href: '/highscores',
          className: active === 'highscores' ? 'active' : ''
        },
        'Highscores'
      )
    ]
  );
}

function App() {
  const [gameId, setGameId] = React.useState(null);

  const [guess, setGuess] = React.useState('');
  const [guesses, setGuesses] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [guessCount, setGuessCount] = React.useState(0);

  const [wordLength, setWordLength] = React.useState(5);
  const [unique, setUnique] = React.useState(false);
  const [gameReady, setGameReady] = React.useState(false);

  const [showNameModal, setShowNameModal] = React.useState(false);
  const [playerName, setPlayerName] = React.useState('');
  const [pendingWin, setPendingWin] = React.useState(null);

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const maxRows = 6;

  React.useEffect(() => {
    startGame(wordLength, unique);
  }, []);

  async function startGame(length, uniqueValue) {
    const res = await fetch('/api/new-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ length, unique: uniqueValue })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    setGameId(data.gameId);
    setGuess('');
    setGuesses([]);
    setGuessCount(0);
    setGameReady(true);
    setShowNameModal(false);
    setPendingWin(null);
    setPlayerName('');

    setMessage(`Antal bokstäver: ${length} ${uniqueValue ? '(unika)' : ''}`);
  }

  async function sendGuess() {
    if (!gameReady || !gameId) return;

    const clean = guess.trim().toUpperCase();
    if (!clean) return;

    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, guess: clean })
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
      return;
    }

    const next = guessCount + 1;
    setGuessCount(next);

    setGuesses(prev => [
      ...prev,
      { word: clean, feedback: data.feedback }
    ]);

    setGuess('');

    if (data.isWin) {
      setPendingWin({ time: data.time, guesses: next });
      setShowNameModal(true);
      setGameReady(false);
      setMessage('🏆 Du vann!');
    } else if (data.gameOver) {
      setGameReady(false);
      setMessage(`💀 Game Over! ${data.currentWord}`);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') sendGuess();
  }

  async function submitHighscore() {
    if (!playerName.trim()) {
      setMessage('Skriv in ditt namn först.');
      return;
    }

    await fetch('/api/highscore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: playerName.trim(),
        time: pendingWin.time,
        guesses: pendingWin.guesses,
        length: wordLength
      })
    });

    setShowNameModal(false);
    setPlayerName('');
    setMessage('🏆 Highscore sparad!');
  }

  const grid = [];

  for (let i = 0; i < maxRows; i++) {
    const row = guesses[i];
    const cells = [];

    for (let j = 0; j < wordLength; j++) {
      const cell = row?.feedback?.[j];
      const letter = row?.word?.[j] || '';

      let bg = '#121213';

      if (cell?.result === 'correct') bg = '#538d4e';
      else if (cell?.result === 'misplaced') bg = '#b59f3b';
      else if (cell) bg = '#3a3a3c';

      cells.push(
        React.createElement(
          'div',
          {
            key: `${i}-${j}`,
            className: 'cell',
            style: { backgroundColor: bg }
          },
          letter
        )
      );
    }

    grid.push(
      React.createElement(
        'div',
        { key: i, className: 'row' },
        cells
      )
    );
  }

  const settings = React.createElement(
    'div',
    { className: 'settings-row' },

    React.createElement(
      'div',
      { className: 'custom-select' },

      React.createElement(
        'div',
        {
          className: 'selected',
          onClick: () => setDropdownOpen(!dropdownOpen)
        },
        `${wordLength} bokstäver ⌄`
      ),

      dropdownOpen &&
        React.createElement(
          'div',
          { className: 'dropdown' },
          [3, 4, 5, 6, 7, 8].map(n =>
            React.createElement(
              'div',
              {
                key: n,
                className: 'option',
                onClick: () => {
                  setWordLength(n);
                  setDropdownOpen(false);
                  startGame(n, unique);
                }
              },
              `${n} bokstäver`
            )
          )
        )
    ),

    React.createElement(
      'button',
      {
        key: 'unique',
        className: unique ? 'btn active' : 'btn',
        onClick: () => {
          const newVal = !unique;
          setUnique(newVal);
          startGame(wordLength, newVal);
        }
      },
      unique ? '✔ Unika bokstäver' : 'Unika bokstäver'
    ),

    React.createElement(
      'button',
      {
        key: 'newgame',
        className: 'btn',
        onClick: () => startGame(wordLength, unique)
      },
      '🔄 Nytt spel'
    )
  );

  const inputRow = React.createElement(
    'div',
    { className: 'input-row' },

    React.createElement('input', {
      value: guess,
      onChange: e => setGuess(e.target.value.toUpperCase()),
      onKeyDown: handleKeyDown,
      maxLength: wordLength,
      disabled: !gameReady
    }),

   React.createElement(
  'button',
  {
    className: 'guess-btn',
    onClick: sendGuess,
    disabled: !gameReady
  },
  '🎯 Gissa'
)
  );

  return React.createElement(
    'div',
    { className: 'page' },

    Navbar({ active: 'game' }),

    React.createElement('h1', null, 'WORDLE'),

    settings,

    React.createElement('div', null, grid),

    inputRow,

    React.createElement('p', null, message),

    showNameModal &&
      React.createElement(
        'div',
        { className: 'modal', key: 'modal' },

        React.createElement(
          'div',
          { className: 'modal-box' },

          React.createElement('h3', null, '🏆 Ny Highscore!'),

          React.createElement(
            'p',
            null,
            `Tid: ${(pendingWin.time / 1000).toFixed(1)} sek`
          ),

          React.createElement(
            'p',
            null,
            `Gissningar: ${pendingWin.guesses}`
          ),

          React.createElement('input', {
            placeholder: 'Ditt namn',
            value: playerName,
            onChange: e => setPlayerName(e.target.value)
          }),

          React.createElement(
            'button',
            { onClick: submitHighscore },
            'Spara score'
          )
        )
      )
  );
}

root.render(React.createElement(App));