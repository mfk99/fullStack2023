import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  
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
    const personNames = persons.map(person => person.name)
    event.preventDefault()
    
    if (personNames.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      personService
        .create(personObject)
        .then(response => setPersons(persons.concat(response.data)))
      setNewName('')
    }
  }

  const personsToShow = (nameFilter === (''))
    ? persons
    :persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()))
    

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App