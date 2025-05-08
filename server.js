const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/gamified', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    score: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    progress: { type: Object, default: {} }
});

const User = mongoose.model('User', UserSchema);

// Signup
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.send({ message: 'User registered!' });
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.send({ message: 'Login successful!', user });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
});

// Save progress
app.post('/save-progress', async (req, res) => {
    const { username, score, level, progress } = req.body;
    await User.updateOne({ username }, { score, level, progress });
    res.send({ message: 'Progress saved!' });
});

// Leaderboard
app.get('/leaderboard', async (req, res) => {
    const topUsers = await User.find().sort({ score: -1 }).limit(10);
    res.send(topUsers);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
