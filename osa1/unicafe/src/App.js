import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood = (good + 1)
    console.log('good')
  }
  const handleNeutralClick = () => {
    console.log('neutral')
  }
  const handleBadClick = () => {
    console.log('bad')
  }

  return (
    <div>
      <h1>
        give feedback
      </h1>
      <div>
        <button onClick={handleGoodClick}>
          good
        </button>
        <button onClick={handleNeutralClick}>
          neutral
        </button>
        <button onClick={handleBadClick}>
          bad
        </button>
      </div>
      <h1>
        statistics
      </h1>
      <p>
        good
      </p>
      <p>
        neutral
      </p>
      <p>
        bad
      </p>
    </div>
  )
}

export default App
