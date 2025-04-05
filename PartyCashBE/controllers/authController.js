const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, password, and username are required' });
  }

  try {
    const user = await registerUser({ email, password, username });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

const login = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required' });
  }

  try {
    const { token } = await loginUser({ login, password });
    res.json({ token });
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND' || error.message === 'INVALID_CREDENTIALS') {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = {
  register,
  login
};
