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
  res.redirect('/');
});

router.get('/', isAuthenticated, async(req, res) => {
  res.render('admin/index',{name: req.user.name,admin: req.user.admin})
})

// SUBROUTES
const employees = require('./employees');
router.use('/employees',employees)

const clients = require('./clients');
router.use('/clients',clients)

const appointments = require('./appointments');
router.use('/appointments',appointments)


router.get('/documents',isAuthenticated, (req, res) => {
  res.render('admin/documents',{name: req.user.name,admin: req.user.admin})
})
// SETTINGS FOR ACCOUNT MANAGEMENT
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
