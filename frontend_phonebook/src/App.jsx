import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success');


  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    // if (persons.some(person => person.name === newName))
    const newPerson = { name: newName, number: newNumber };

    // Check if the name already exists in the phonebook
    if (existingPerson) {
      // alert(`${newName} is already added to the phonebook`); // JS template string
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        // Use PUT method to update the person's number
        personsService
          .update(existingPerson.id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${updatedPerson.name}'s number`, 'success');
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              showNotification(`Information of ${newName} has already been removed from the server.`, 'error');
              setPersons(persons.filter(person => person.id !== existingPerson.id)); // Remove from UI 
            } else {
              showNotification(`Failed to update ${newName}'s information.`, 'error');
            }

          });
      }
    } else {
      // new person added 
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${newPerson.name}`, 'success');
        })
        .catch(error => {
          showNotification(`Failed to add ${newPerson.name}.`, 'error');
        });

    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          showNotification(`Deleted ${name}`, 'success');
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            showNotification(`The person '${name}' has already been removed from the server.`, 'error');
            setPersons(persons.filter(person => person.id !== id)); // Remove from UI
          } else {
            showNotification(`Failed to delete ${name}.`, 'error');
          }
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  // Filter persons based on searchName
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);

    // Automatically hide the notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} type={notificationType} />

      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={deletePerson} />
    </div>
  );
}

export default App

/*
const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);
    // if (persons.some(person => person.name === newName))
    const newPerson = { name: newName, number: newNumber };

    // Check if the name already exists in the phonebook
    if (existingPerson) {
      // alert(`${newName} is already added to the phonebook`); // JS template string
      if (window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)) {
        // Use PUT method to update the person's number
        personsService
          .update(existingPerson.id, newPerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${updatedPerson.name}'s number`, 'success');
          })
          .catch(error => { 
            showNotification(`The information of ${newName} has already been removed from the server.`, 'error');
            setPersons(persons.filter(person => person.id !== existingPerson.id)); // Remove from UI
          });
      }
    } else {
      // new person added 
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${newPerson.name}`, 'success');
        })
        .catch(error => {
          showNotification(`Failed to add ${newPerson.name}.`, 'error');
        });
      // axios
      //   .post('http://localhost:3001/persons', newPerson)
      //   .then(response => {
      //     setPersons(persons.concat(response.data))
      //     setNewName('')
      //     setNewNumber('') 
      //   })
      //setPersons(persons.concat(newPerson));
      //setNewName(''); // Clear name input field
      //setNewNumber(''); // Clear number input field
    }
  };

*/