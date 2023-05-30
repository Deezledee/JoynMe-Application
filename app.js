require('dotenv/config');
require('./db');

const express = require('express');
const hbs = require('hbs');
const app = express();

require('./config')(app);

const projectName = 'JoynMe Application'
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${projectName}`;

const session = require("express-session")
const MongoStore = require("connect-mongo")

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      resave: true,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
      })
    })
  )

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);
const auth = require('./routes/auth');
app.use('/', auth);

require('./error-handling')(app);

module.exports = app;

