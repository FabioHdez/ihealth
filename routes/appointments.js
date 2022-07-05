const express = require('express')
const router = express.Router()
const passport = require('passport')
const {isAuthenticated,isAdmin} = require('../helpers/auth');
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Appointment = require('../models/Appointment')

router.get('/',isAuthenticated, async(req, res) => {
  let appointments
  if (req.user.admin){
    appointments = await Appointment.find({deleted: false}).lean().sort({date: 'desc'});
  }else{
    appointments = await Appointment.find({deleted: false,employee: req.user.id}).lean().sort({date: 'desc'});
  }
  res.render('appointments/appointments',{appointments,name: req.user.name,admin: req.user.admin})
})
router.post('/',isAuthenticated, async(req, res) => {
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
router.get('/create',isAuthenticated, async(req, res) => {
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
router.get('/:id',isAuthenticated, async(req, res) => {
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

router.post('/:id',isAuthenticated,async(req, res) => {
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

module.exports = router
