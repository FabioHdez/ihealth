const mongoose = require('mongoose');
const { Schema } = mongoose;

const Employee = require('./Employee')

const ClientSchema = new Schema({
  name: {type: String, required: true},
  email: {type:String,required:false},
  phone: {type:Number,required:false},
  employee: {type: Schema.Types.ObjectId, ref: 'Employee', required:false},
  employeeName: {type:String, default:"NOT FOUND",required:true},
  deleted: {type: Boolean,default: false,required: true}
})

module.exports = mongoose.model('Client', ClientSchema);
