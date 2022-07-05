const express = require('express')
const router = express.Router()
const passport = require('passport')
const {isAuthenticated,isAdmin} = require('../helpers/auth');
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Appointment = require('../models/Appointment')

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
  res.render('employees/employees',{employees,name: req.user.name,admin: req.user.admin})
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
  res.render('employees/employees_create',{name: req.user.name,admin: req.user.admin})
})
// Single EMPLOYEE
router.get('/employees/:id',isAdmin, async(req, res) => {
  let employee;
  try{
    employee = await Employee.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/employees')
  }
  res.render('employees/employee',{employee,name: req.user.name,admin: req.user.admin})
})

router.post('/employees/:id',isAdmin, async(req, res) => {
  try{
    (req.body.admin == 'on') ? req.body.admin = true : req.body.admin = false
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
  res.render('clients/clients',{clients,name: req.user.name,admin: req.user.admin})
})
router.post('/clients',isAuthenticated, async(req, res) => {
  const newClient = new Client(req.body)
  newClient.employee = req.user.id
  newClient.employeeName = req.user.name
  await newClient.save()
  res.redirect('/admin/clients')
})
router.get('/clients/create',isAuthenticated, (req, res) => {
  res.render('clients/clients_create',{name: req.user.name,admin: req.user.admin})
})
// Single Client FIX ADMIN REQUIREMENTS!!!!!!!!!!!!!!!!!!!!
router.get('/clients/:id',isAuthenticated, async(req, res) => {
  let client;
  try{
    client = await Client.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/clients')
  }
  res.render('clients/client',{client,name: req.user.name,admin: req.user.admin})
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

// Appointments
router.get('/appointments',isAuthenticated, async(req, res) => {
  let appointments
  if (req.user.admin){
    appointments = await Appointment.find({deleted: false}).lean().sort({date: 'desc'});
  }else{
    appointments = await Appointment.find({deleted: false,employee: req.user.id}).lean().sort({date: 'desc'});
  }
  res.render('appointments/appointments',{appointments,name: req.user.name,admin: req.user.admin})
})
router.post('/appointments',isAuthenticated, async(req, res) => {
  const newAppointment = new Appointment(req.body)
  let employee
  if (req.body.employeeid == undefined || req.body.employeeid == 'None') {
    employee = await Employee.findById(req.user.id)
  }else{
    employee = await Employee.findById(req.body.employeeid)
  }
  newAppointment.employee = employee
  newAppointment.employeeName = employee.name
  if (req.body.clientid != 'None') {
    client = await Client.findById(req.body.clientid)
    newAppointment.client = client
    newAppointment.clientName = client.name
  }
  await newAppointment.save()
  res.redirect('/admin/appointments')
})
router.get('/appointments/create',isAuthenticated, async(req, res) => {
  let clients;
  let employees;
  if (req.user.admin){
    clients = await Client.find({deleted: false}).lean()
    employees = await Employee.find({deleted: false}).lean()
  }else{
    clients = await Client.find({deleted: false,employee: req.user.id}).lean()
  }
  res.render('appointments/appointments_create',{name: req.user.name,admin: req.user.admin,clients:clients,employees:employees})
})
router.get('/appointments/:id',isAuthenticated, async(req, res) => {
  let appointment;
  try{
    appointment = await Appointment.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/appointments')
  }
  let clients;
  let employees;
  if (req.user.admin){
    clients = await Client.find({deleted: false}).lean()
    employees = await Employee.find({deleted: false}).lean()
  }else{
    clients = await Client.find({deleted: false,employee: req.user.id}).lean()
  }
  res.render('appointments/appointment',{appointment, name: req.user.name, admin: req.user.admin,clients:clients,employees:employees})
})

router.post('/appointments/:id',isAuthenticated,async(req, res) => {
  try{
    appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body)
    let employee
    if (req.body.employeeid == undefined || req.body.employeeid == 'None') {
      employee = await Employee.findById(req.user.id)
    }else{
      employee = await Employee.findById(req.body.employeeid)
    }
    appointment.employee = employee
    appointment.employeeName = employee.name
    if (req.body.clientid != 'None') {
      client = await Client.findById(req.body.clientid)
      appointment.client = client
      appointment.clientName = client.name
    }
    if(req.body.completed == undefined){
      appointment.completed = false;
    }
    if(req.body.task == undefined){
      appointment.task = false;
    }
    appointment.save()
  }catch(err){
    console.log(err)
    res.redirect('/admin/appointments')
  }
  res.redirect('/admin/appointments')
})

router.get('/documents',isAuthenticated, (req, res) => {
  res.render('admin/documents',{name: req.user.name,admin: req.user.admin})
})
router.get('/settings',isAuthenticated, async(req, res) => {
  employee = await Employee.findById(req.user.id).lean();
  res.render('admin/settings',{employee,name: req.user.name,admin: req.user.admin})
})
router.post('/settings/:id',isAuthenticated, async(req, res) => {
  try{
    await Employee.findByIdAndUpdate(req.params.id,req.body)
  }catch(err){
    console.log(err)
    res.redirect('/admin/settings')
  }
  res.redirect('/admin/')
})

module.exports = router
