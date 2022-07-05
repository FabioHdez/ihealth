const express = require('express')
const router = express.Router()
const passport = require('passport')
const {isAuthenticated,isAdmin} = require('../helpers/auth');
const Client = require('../models/Client')
const Employee = require('../models/Employee')
const Appointment = require('../models/Appointment')

router.get('/',isAuthenticated, async(req, res) => {
  let clients
  if (req.user.admin){
    clients = await Client.find({deleted: false}).lean()
  }else{
    clients = await Client.find({deleted: false,employee: req.user.id}).lean()
  }
  res.render('clients/clients',{clients,name: req.user.name,admin: req.user.admin})
})
router.post('/',isAuthenticated, async(req, res) => {
  const newClient = new Client(req.body)
  newClient.employee = req.user.id
  newClient.employeeName = req.user.name
  await newClient.save()
  res.redirect('/admin/clients')
})
router.get('/create',isAuthenticated, (req, res) => {
  res.render('clients/clients_create',{name: req.user.name,admin: req.user.admin})
})
router.get('/:id',isAuthenticated, async(req, res) => {
  let client;
  try{
    client = await Client.findById(req.params.id).lean()
  }catch(err){
    res.redirect('/admin/clients')
  }
  res.render('clients/client',{client,name: req.user.name,admin: req.user.admin})
})

router.post('/:id',isAuthenticated, async(req, res) => {
  try{
    await Client.findByIdAndUpdate(req.params.id,req.body)
  }catch(err){
    console.log(err)
    res.redirect('/admin/clients')
  }
  res.redirect('/admin/clients')
})

module.exports = router
