const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Update CORS configuration
app.use(cors({
	origin: 'http://52.53.239.57:3000', // Replace with your frontend's domain
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/notepad');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Notes Schema and Endpoints
const NoteSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    content: String
});

const Note = mongoose.model('Note', NoteSchema);

app.post('/save-note', async (req, res) => {
    const { token, content } = req.body;
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const note = new Note({ userId: decoded.id, content });
    await note.save();
    res.status(201).send('Note saved');
});

app.get('/get-notes', async (req, res) => {
    const { token } = req.query;
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const notes = await Note.find({ userId: decoded.id });
    res.json(notes);
});

app.listen(5000, () => console.log('Server running on port 5000'));

