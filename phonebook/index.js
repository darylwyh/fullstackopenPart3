const express = require('express')
const app = express()

app.use(express.json()) // json=parser, takes JSON data to JS obejct, attach to request obj 

let notes = [
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
    response.json(notes) // respond JSON.stringify, set to application/json
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find(note => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.statusMessage = "Persons with the specified ID not found";
        response.status(404).json({ error: "Note with the specified ID not found" });
    }
});

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
