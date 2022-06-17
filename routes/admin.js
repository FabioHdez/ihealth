const express = require('express')
const router = express.Router()
const passport = require('passport')

const {isAuthenticated,isAdmin} = require('../helpers/auth');

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
  res.render('admin/index',req.user)
})

// Employee
const Employee = require('../models/Employee')
router.get('/employees',isAdmin, async(req, res) => {
  const employees = await Employee.find({deleted: false}).lean()
  res.render('admin/employees',{employees,name: req.user.name})
})
router.post('/employees',isAdmin, async(req, res) => {
  const newEmployee = new Employee(req.body)
  if(req.body.password == req.body.confirmPass){
    newEmployee.password = await newEmployee.encryptPassword(newEmployee.password);
    await newEmployee.save()
  }
  res.redirect('/admin/employees')
})
router.get('/employees/create',isAdmin, (req, res) => {
  res.render('admin/employees_create',req.user)
})

// Client
const Client = require('../models/Client')
router.get('/clients',isAuthenticated, async(req, res) => {
  // LATER ADD SOME AUTHENTICATION FOR EACH EMPLOYEE TO ADMINISTER THEIR OWN CLIENT!!!!!!!!!!!!!!!!!!!!
  const clients = await Client.find({deleted: false}).lean()
  res.render('admin/clients',{clients,name: req.user.name})
})
router.post('/clients',isAuthenticated, async(req, res) => {
  const newClient = new Client(req.body)
  await newClient.save()
  res.redirect('/admin/clients')
})
router.get('/clients/create',isAuthenticated, (req, res) => {
  res.render('admin/clients_create',req.user)
})

// Others
router.get('/appointments',isAuthenticated, (req, res) => {
  res.render('admin/appointments',{layout:"calendar.hbs",name: req.user.name})
})
router.get('/documents',isAuthenticated, (req, res) => {
  res.render('admin/documents',req.user)
})

module.exports = router
