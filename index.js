const express = require('express')
const app = express()
require('dotenv').config()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
// Body parser
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
require('./database');

// Template engine
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', 'hbs');
app.use(express.static('public'))

// routes
var home = require('./routes/home')
app.use('/',home);
var admin = require('./routes/admin')
app.use('/admin',admin);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started")
})
