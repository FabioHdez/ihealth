const mongoose = require('mongoose');
const { Schema } = mongoose;

const Employee = require('./Employee')
const Client = require('./Client')

const Appointment = new Schema({
  title: {type: String, required: true},
  description: {type: String,required: false},
  date: {type: Date,required: true},
  client: {type: Schema.Types.ObjectId, ref: 'Client', required:false},
  clientName: {type:String, default:"NOT FOUND",required:true},
  employee: {type: Schema.Types.ObjectId, ref: 'Employee', required:false},
  employeeName: {type:String, default:"NOT FOUND",required:true},
  task: {type: Boolean,default: false,required: true},
  completed: {type: Boolean,default: false,required: true},
  deleted: {type: Boolean,default: false,required: true}
})

module.exports = mongoose.model('Client', ClientSchema);
