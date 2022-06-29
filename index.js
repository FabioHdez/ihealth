const express = require('express')
const app = express()
require('dotenv').config()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const moment = require('moment')

// initializations
require('./database');
require('./config/passport');

// Body parser
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// AUTHENTICATION
app.use(session({
  secret: process.env.SESSION_SECRET,
	cookie: {expires: new Date(253402300000000)},  // Approximately Friday, 31 Dec 9999 23:59:59 GMT
	resave: false,
	saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DB_CONNECTION })
}))
app.use(passport.initialize());
app.use(passport.session());
// Template engine
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs',
  // custom helpers
  helpers:{
    formatDate:function(date,format){
      var mmnt = moment(date)
      return mmnt.format(format)
    }
  }
});
app.engine('hbs',hbs.engine)

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
