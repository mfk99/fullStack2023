import { useState } from 'react'

const Statistics = (props) => {

  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const sum = good+neutral+bad

  if (sum === 0) {
    return (
      <div>
        <p>
          No feedback given
        </p>
      </div>
    )
  }

  return(
    <div>
      
      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />
      <StatisticLine text="all" value ={sum} />
      <StatisticLine text="average" value ={(good-bad)/sum} />
      <StatisticLine text="positive" value ={(good/sum)*100} />
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return(
      <p>
      {props.text} {props.value} %
    </p>
    )
  }
  return(
    <p>
      {props.text} {props.value}
    </p>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>
        give feedback
      </h1>
      <div>
        <Button text="good" onClick={() => setGood(good + 1)}/>
        <Button text="neutral" onClick={() => setNeutral(neutral + 1)}/>
        <Button text="bad" onClick={() => setBad(bad + 1)}/>
      </div>
      <h1>
        statistics
      </h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
      
    </div>
  )
}

export default App
