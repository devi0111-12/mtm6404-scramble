/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  'apple',
  'banana',
  'orange',
  'grapes',
  'mango',
  'peach',
  'cherry',
  'lemon',
  'melon',
  'papaya'
]

function App() {
  const [gameWords, setGameWords] = React.useState(() => {
    const saved = localStorage.getItem('gameWords')
    return saved ? JSON.parse(saved) : shuffle(words)
  })

  const [points, setPoints] = React.useState(() => {
    return Number(localStorage.getItem('points')) || 0
  })

  const [strikes, setStrikes] = React.useState(() => {
    return Number(localStorage.getItem('strikes')) || 0
  })

  const [passes, setPasses] = React.useState(() => {
    const saved = localStorage.getItem('passes')
    return saved === null ? 3 : Number(saved)
  })

  const [guess, setGuess] = React.useState('')
  const [message, setMessage] = React.useState('')

  const [scrambled, setScrambled] = React.useState(() => {
    const saved = localStorage.getItem('scrambled')
    return saved || shuffle(gameWords[0] || '')
  })

  React.useEffect(() => {
    localStorage.setItem('gameWords', JSON.stringify(gameWords))
    localStorage.setItem('points', points)
    localStorage.setItem('strikes', strikes)
    localStorage.setItem('passes', passes)
    localStorage.setItem('scrambled', scrambled)
  }, [gameWords, points, strikes, passes, scrambled])

  const gameOver = strikes >= 3 || gameWords.length === 0

  function nextWord() {
    const remaining = gameWords.slice(1)
    setGameWords(remaining)
    setScrambled(remaining.length > 0 ? shuffle(remaining[0]) : '')
  }

  function handleGuess(event) {
    event.preventDefault()

    if (gameOver || guess.trim() === '') return

    if (guess.trim().toLowerCase() === gameWords[0].toLowerCase()) {
      setPoints(points + 1)
      setMessage('Correct answer!')
      nextWord()
    } else {
      setStrikes(strikes + 1)
      setMessage('Incorrect answer! Try again.')
    }

    setGuess('')
  }

  function handlePass() {
    if (passes > 0 && !gameOver) {
      setPasses(passes - 1)
      setMessage('Word skipped!')
      nextWord()
    }
  }

  function playAgain() {
    const newWords = shuffle(words)

    setGameWords(newWords)
    setPoints(0)
    setStrikes(0)
    setPasses(3)
    setGuess('')
    setMessage('')
    setScrambled(shuffle(newWords[0]))
  }

  return (
    <div className="game">
      <h1>Scramble</h1>

      <p>Points: {points}</p>
      <p>Strikes: {strikes} / 3</p>
      <p>Passes Remaining: {passes}</p>

      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Your final score: {points}</p>
          <button onClick={playAgain}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>{scrambled}</h2>

          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Enter your guess"
            />
            <button type="submit">Guess</button>
          </form>

          <button onClick={handlePass} disabled={passes === 0}>
            Pass
          </button>

          <p>{message}</p>
        </div>
      )}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
