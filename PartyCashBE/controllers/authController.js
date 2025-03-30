const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Database connection

// Register new user
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]);
    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
};

// Login user and return JWT token
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).send('User not found');

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
};

module.exports = {
  register,
  login,
};
