const { User } = require('../models/index.js');

// GET - Show registration page
function getRegisterPage(req, res) {
  if (req.session && req.session.user) {
    res.redirect('/fridge');
  } else {
    res.render('register');
  }
}

// POST - Register user
async function registerUser(req, res) {
  // const { email, password, name } = req.body;
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('register', { error: 'User already exists' });
    }

    // Create a new user
    const newUser = await User.create({ email, password, name });

    // Set user session data
    req.session.user = newUser;

    // Redirect to /fridge route
    res.redirect('/fridge');
  } catch (error) {
    console.error('Error registering user:', error);
    res.render('register', { error: 'Internal server error' });
  }
}

module.exports = {
  getRegisterPage,
  registerUser,
};
