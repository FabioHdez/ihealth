const express = require('express')
const router = express.Router()
const passport = require('passport')

const {isAuthenticated} = require('../helpers/auth');

// LOGGING IN and OUT
router.get('/login', (req, res) => {
  if (req.isAuthenticated()){
    return res.redirect('/admin')
  }
  res.render('admin/login')
})

router.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/admin',
  failureRedirect: '/admin/login',
}));

router.get('/logout', isAuthenticated, (req, res) => {
	req.session.destroy();
  res.redirect('/admin/login');
});

router.get('/', isAuthenticated, async(req, res) => {
  res.render('admin/index')
})

// Employee
// ADD HIGHER PRIVILEGES TO THIS PAGE FOR LATER
const Employee = require('../models/Employee')
router.get('/employees',isAuthenticated, async(req, res) => {
  const employees = await Employee.find({deleted: false}).lean()
  res.render('admin/employees',{employees})
})
router.post('/employees',isAuthenticated, async(req, res) => {
  const newEmployee = new Employee(req.body)
  if(req.body.password == req.body.confirmPass){
    newEmployee.password = await newEmployee.encryptPassword(newEmployee.password);
    await newEmployee.save()
  }
  res.redirect('/admin/employees')
})
router.get('/employees/create',isAuthenticated, (req, res) => {
  res.render('admin/employees_create')
})

// Client
const Client = require('../models/Client')
router.get('/clients',isAuthenticated, async(req, res) => {
  // LATER ADD SOME AUTHENTICATION FOR EACH EMPLOYEE TO ADMINISTER THEIR OWN CLIENT!!!!!!!!!!!!!!!!!!!!
  const clients = await Client.find({deleted: false}).lean()
  res.render('admin/clients',{clients})
})
router.post('/clients',isAuthenticated, async(req, res) => {
  const newClient = new Client(req.body)
  await newClient.save()
  res.redirect('/admin/clients')
})
router.get('/clients/create',isAuthenticated, (req, res) => {
  res.render('admin/clients_create')
})

// Others
router.get('/appointments',isAuthenticated, (req, res) => {
  res.render('admin/appointments',{layout:"calendar.hbs"})
})
router.get('/documents',isAuthenticated, (req, res) => {
  res.render('admin/documents')
})

module.exports = router
