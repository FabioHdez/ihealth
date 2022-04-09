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

router.get('/clients', (req, res) => {
  res.render('admin/clients')
})

module.exports = router
