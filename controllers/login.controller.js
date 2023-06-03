const { User } = require('../models/index.js');

// Show Login page
function getLoginPage(req, res) {
  if (req.session && req.session.user) {
    res.redirect('/fridge');
  } else {
    res.render('login');
  }
}

// Show logout page
function getLogoutPage(req, res) {
  res.render('logout');
}

async function logInUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.render('login', {
        error: 'User with provided email does not exist',
      });
    }

    if (existingUser.password !== password) {
      return res.render('login', { error: 'Invalid password!' });
    }

    // Set user session data
    req.session.user = existingUser;

    res.redirect('/fridge');
  } catch (error) {
    console.error('Error logging in:', error);
    res.render('login', { error: 'Internal server error' });
  }
}

//GET -  Show Login page
function logoutUser(req, res) {
  if (req.session) {
    req.session.destroy(function () {
      res.redirect('/logout');
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  getLoginPage,
  logInUser,
  logoutUser,
  getLogoutPage,
};
