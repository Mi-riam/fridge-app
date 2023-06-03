const express = require('express');
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');

const db = require('./models/index.js');
const router = require('./routes.js');

const app = express();
const port = 3000;

async function connectDatabase() {
  try {
    await db.sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function initializeApplication() {
  try {
    // Enable views
    app.set('view engine', 'ejs');

    // Configure user session
    app.use(
      session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        genid: () => uuidv4(),
      })
    );

    // Serve static files from the 'public' directory
    app.use('/static', express.static('public'));

    app.use(express.urlencoded({ extended: true }));

    // Serve routes from 'routes' file
    app.use(router);

    // Connect to the db
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

initializeApplication();
