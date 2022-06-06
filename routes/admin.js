const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('admin/login')
})

router.get('/', (req, res) => {
  res.render('admin/index')
})

router.get('/employees', (req, res) => {
  res.render('admin/employees')
})
router.post('/employees', (req, res) => {
  console.log(req.body)
  res.redirect('/admin/employees')
})
router.get('/employees/create', (req, res) => {
  res.render('admin/employees_create')
})

router.get('/clients', (req, res) => {
  res.render('admin/clients')
})
router.get('/appointments', (req, res) => {
  res.render('admin/appointments',{layout:"calendar.hbs"})
})
router.get('/documents', (req, res) => {
  res.render('admin/documents')
})

module.exports = router
