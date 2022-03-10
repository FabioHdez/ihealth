const express = require('express')
const app = express()
require('dotenv').config()
const exphbs = require('express-handlebars')


// Template engine
app.engine('hbs', exphbs.engine({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', 'hbs');
app.use(express.static('./public'))


var home = require('./routes/home')
app.use('/',home);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started")
})
