const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const nimi = 'Frans'
  const ika = 1960
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Matias" age={5+10} />
      <Hello name={nimi} age={ika} />
    </div>
  )
}

export default App