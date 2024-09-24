const express = require('express')
const morgan = require('morgan'); // Import morgan
const cors = require('cors')

const app = express()

//app.use(morgan('tiny')); // Use the "tiny" configuration for logging
app.use(express.json()) // json=parser, takes JSON data to JS obejct, attach to request obj 
app.use(cors())
app.use(express.static('dist'))

// Custom logging, more info than tiny 
// Custom token to log request body
morgan.token('body', (req) => {
    return JSON.stringify(req.body);
});

// Use morgan with a custom format that includes the request body for POST requests
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let phonebooks = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>') // auto set to text/html
})

app.get('/api/persons', (request, response) => {
    response.json(phonebooks) // respond JSON.stringify, set to application/json
})

app.get('/api/info', (request, response) => {
    const currentTime = new Date().toString();
    const numberOfEntries = phonebooks.length;

    const responseText = `<p>phonebooks has info for ${numberOfEntries} people</p> <p>${currentTime}</p>`;
    // Send the response
    response.send(responseText);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const phonebook = phonebooks.find(phonebook => phonebook.id === id);

    if (phonebook) {
        response.json(phonebook);  // Return the single person found
    } else {
        response.statusMessage = "Person with the specified ID not found";
        response.status(404).json({ error: "phonebook with the specified ID not found" });
    }
});



app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebooks = phonebooks.filter(phonebook => phonebook.id !== id)

    response.status(204).end()
})

//create new entries
const generateId = () => {
    const maxId = phonebooks.length > 0
        ? Math.max(...phonebooks.map(n => Number(n.id))) // "three dot" spread syntax transfrom array into indi nums
        : 0
    return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    // Check if the name already exists in the phonebook
    const nameExists = phonebooks.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const phonebook = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    phonebooks = phonebooks.concat(phonebook);

    // Respond with the newly created person instead of the entire array
    response.json(phonebook);
});


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


/*
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const phonebook = phonebooks.find(phonebooks => phonebooks.id === id);

    if (phonebook) {
        response.json(phonebook);
    } else {
        response.statusMessage = "Persons with the specified ID not found";
        response.status(404).json({ error: "phonebook with the specified ID not found" });
    }
});
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        });
    }
    
    // Check if the name already exists in the phonebook
    const nameExists = phonebooks.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    const phonebook = {
      name: body.name,
      number: body.number,
      //important: Boolean(body.important) || false,
      id: generateId(),
    }
  
    phonebooks = phonebooks.concat(phonebook)
  
    response.json(phonebook)
})
  
*/