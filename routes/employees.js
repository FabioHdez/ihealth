const express = require('express')
const router = express.Router()
const passport = require('passport')
const {isAuthenticated,isAdmin} = require('../helpers/auth');
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Appointment = require('../models/Appointment')

router.get('/',isAdmin, async(req, res) => {
  const employees = await Employee.find({deleted: false}).lean()
  res.render('employees/employees',{employees,name: req.user.name,admin: req.user.admin})
})
router.post('/',isAdmin, async(req, res) => {
  const newEmployee = new Employee(req.body)
  if(req.body.password == req.body.confirmPass){
    newEmployee.password = await newEmployee.encryptPassword(newEmployee.password);
    await newEmployee.save()
  }
  res.redirect('/admin/employees')
})
router.get('/create',isAdmin, (req, res) => {
  res.render('employees/employees_create',{name: req.user.name,admin: req.user.admin})
})

router.get('/:id',isAdmin, async(req, res) => {
  let employee;
  try{
    employee = await Employee.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/employees')
  }
  res.render('employees/employee',{employee,name: req.user.name,admin: req.user.admin})
})

router.post('/:id',isAdmin, async(req, res) => {
  try{
    (req.body.admin == 'on') ? req.body.admin = true : req.body.admin = false
    await Employee.findByIdAndUpdate(req.params.id,req.body)
  }catch(err){
    console.log(err)
    res.redirect('/admin/employees')
  }
  res.redirect('/admin/employees')
})

module.exports = router
