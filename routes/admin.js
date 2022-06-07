const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('admin/login')
})

router.get('/', (req, res) => {
  res.render('admin/index')
})

// Employee
const Employee = require('../models/Employee')
router.get('/employees', (req, res) => {
  res.render('admin/employees')
})
router.post('/employees', async(req, res) => {
  const newEmployee = new Employee(req.body)
  if(req.body.password == req.body.confirmPass){
    newEmployee.password = await newEmployee.encryptPassword(newEmployee.password);
    await newEmployee.save()
  }
  res.redirect('/admin/employees')
})
router.get('/employees/create', (req, res) => {
  res.render('admin/employees_create')
})

// Client
router.get('/clients', (req, res) => {
  res.render('admin/clients')
})
router.post('/clients', (req, res) => {
  console.log(req.body)
  res.redirect('/admin/clients')
})
router.get('/clients/create', (req, res) => {
  res.render('admin/clients_create')
})

// Others
router.get('/appointments', (req, res) => {
  res.render('admin/appointments',{layout:"calendar.hbs"})
})
router.get('/documents', (req, res) => {
  res.render('admin/documents')
})

module.exports = router
