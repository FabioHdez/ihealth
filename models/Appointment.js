const mongoose = require('mongoose');
const { Schema } = mongoose;

const Employee = require('./Employee')
const Client = require('./Client')

const AppointmentSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String,required: false},
  date: {type: Date, default: Date.now,required: true},
  client: {type: Schema.Types.ObjectId, ref: 'Client', required:false},
  clientName: {type:String, default:"None",required:false},
  employee: {type: Schema.Types.ObjectId, ref: 'Employee', required:false},
  employeeName: {type:String, default:"None",required:true},
  task: {type: Boolean,default: false,required: true},
  completed: {type: Boolean,default: false,required: true},
  deleted: {type: Boolean,default: false,required: true}
})

module.exports = mongoose.model('Appointment', AppointmentSchema);
