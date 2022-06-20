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
// Single EMPLOYEE
router.get('/employees/:id',isAdmin, async(req, res) => {
  let employee;
  try{
    employee = await Employee.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/employees')
  }
  res.render('admin/employee',{employee,name: req.user.name,admin: req.user.admin})
})

router.post('/employees/:id',isAdmin, async(req, res) => {
  try{
    await Employee.findByIdAndUpdate(req.params.id,req.body)
  }catch(err){
    console.log(err)
    res.redirect('/admin/employees')
  }
  res.redirect('/admin/employees')
})

// Client
router.get('/clients',isAuthenticated, async(req, res) => {
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
// Single Client FIX ADMIN REQUIREMENTS!!!!!!!!!!!!!!!!!!!!
router.get('/clients/:id',isAuthenticated, async(req, res) => {
  let client;
  try{
    client = await Client.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/clients')
  }
  res.render('admin/client',{client,name: req.user.name,admin: req.user.admin})
})

router.post('/clients/:id',isAuthenticated, async(req, res) => {
  try{
    await Client.findByIdAndUpdate(req.params.id,req.body)
  }catch(err){
    console.log(err)
    res.redirect('/admin/clients')
  }
  res.redirect('/admin/clients')
})

// Others
router.get('/appointments',isAuthenticated, (req, res) => {
  res.render('admin/appointments',{name: req.user.name,admin: req.user.admin})
})
router.get('/documents',isAuthenticated, (req, res) => {
  res.render('admin/documents',{name: req.user.name,admin: req.user.admin})
})

module.exports = router
