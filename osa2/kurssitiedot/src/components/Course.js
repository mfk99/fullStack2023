
const Course = (props) => {
  const name = props.course.name
  const parts = props.course.parts

  return(
    <>
    <Header name = {name}/>
    <Content parts = {parts}/>
    </>
  )
}

const Header = (props) => {
  return (
  <h1>
    {props.name}
  </h1>
  )
}

const Content = (props) => {
  const parts = props.parts
  return(
    <>
      {parts.map(part =>
    <div key = {part.id}>
      <Part part = {part}/>
    </div> 
     )}
    <Total parts={parts}/>
    </>
  )
}

const Part = (props) => {
  return(
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Total = (props) => {
  const exercises = props.parts.map(part => part.exercises)
  const sum = exercises.reduce( (s, p) => s + p )
  return(
    <div>
      <b>total of {sum} exercises </b>
    </div>
  )
}

export default Course