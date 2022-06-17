const express = require('express')
const router = express.Router()
const passport = require('passport')

const {isAuthenticated,isAdmin} = require('../helpers/auth');

const Client = require('../models/Client')
const Employee = require('../models/Employee')

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
  res.render('admin/index',{name: req.user.name,admin: req.user.admin})
})

// Employee
router.get('/employees',isAdmin, async(req, res) => {
  const employees = await Employee.find({deleted: false}).lean()
  res.render('admin/employees',{employees,name: req.user.name,admin: req.user.admin})
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
  res.render('admin/employees_create',{name: req.user.name,admin: req.user.admin})
})

// Client
router.get('/clients',isAuthenticated, async(req, res) => {
  // LATER ADD SOME AUTHENTICATION FOR EACH EMPLOYEE TO ADMINISTER THEIR OWN CLIENT!!!!!!!!!!!!!!!!!!!!
  let clients
  if (req.user.admin){
    clients = await Client.find({deleted: false}).lean()
  }else{
    clients = await Client.find({deleted: false,employee: req.user.id}).lean()
  }
  res.render('admin/clients',{clients,name: req.user.name,admin: req.user.admin})
})
router.post('/clients',isAuthenticated, async(req, res) => {
  const newClient = new Client(req.body)
  newClient.employee = req.user.id
  newClient.employeeName = req.user.name
  await newClient.save()
  res.redirect('/admin/clients')
})
router.get('/clients/create',isAuthenticated, (req, res) => {
  res.render('admin/clients_create',{name: req.user.name,admin: req.user.admin})
})

// Others
router.get('/appointments',isAuthenticated, (req, res) => {
  res.render('admin/appointments',{layout:"calendar.hbs",name: req.user.name,admin: req.user.admin})
})
router.get('/documents',isAuthenticated, (req, res) => {
  res.render('admin/documents',{name: req.user.name,admin: req.user.admin})
})

module.exports = router
