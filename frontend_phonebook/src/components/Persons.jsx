import React from 'react';

const Persons = ({ personsToShow, handleDelete }) => {
  console.log("Rendering personsToShow:", personsToShow);
  return (
    <div>
      {personsToShow.map(person => (
        <div key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
        </div>
        
      ))}
    </div>
  );
};

export default Persons;
