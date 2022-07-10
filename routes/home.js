const express = require('express')
const router = express.Router()
const Appointment = require('../models/Appointment')

router.get('/', (req, res) => {
  res.render('home')
})
router.post('/', async(req, res) => {
  const newAppointment = new Appointment(req.body)
  newAppointment.title = "Appointment for: "+req.body.name+" - "+ req.body.date
  await newAppointment.save()
  res.redirect('/')
})

module.exports = router
