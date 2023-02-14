import { useState, useEffect } from 'react'
import personService from './services/persons'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    personService
      .getAll()
      .then(response => setPersons(response.data))
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const index = persons.findIndex(person => person.name === newName)

    if (index !== -1) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const personId = persons[index].id
        personService
          .update(personId, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personId ? person :returnedPerson))
            setNotification(`Changed ${newName}'s number`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
        })
        .catch(error => {
          setError(`Information of ${newName} has alreay been removed from the server`)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
      }
    } else {
      personService
        .create(personObject)
        .then(response => {
          console.log('THEN');
          setPersons(persons.concat(personObject))
          setNotification(`Added ${newName}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        setNewName('')
        setNewNumber('')
        })
        .catch(error => {
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    }
  }

  const removePerson = (person) => {
    if (window.confirm(`Do you really want to delete ${person.name}`)) {
      personService
        .remove(person.id)
        .then(response => setPersons(response.data))
        setNotification(`Removed ${person.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
    }
  }

  const personsToShow = (nameFilter === (''))
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
    

  return (
    <div>
      <h2>Phonebook</h2>
      <Error message={error}/>
      <Notification message={notification}/>
      <Filter 
      nameFilter={nameFilter} 
      handleFilterChange={handleFilterChange}/>
      <h2>add new person</h2>
      <PersonForm
      addPerson={addPerson}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson}/>
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
}

const PersonForm = (props) => {

  return(
    <form onSubmit={props.addPerson}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = (props) => {
  return (
    props.persons.map(person =>
      <div key={person.name}>
        {person.name} {person.number}  
        
        <button onClick = {() => props.removePerson(person)}>delete</button>
      </div>
      )
  )
}

const Filter = (props) => {
  return (
    <>
    filter shown with 
    <input value={props.nameFilter} onChange={props.handleFilterChange}/>
    </>
  )
}

export default App