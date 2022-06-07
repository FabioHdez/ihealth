const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new Schema({
  name: {type: String, required: true},
  email: {type:String,required:false},
  phone: {type:Number,required:false},
  deleted: {type: Boolean,default: false,required: true}
})

module.exports = mongoose.model('Client', ClientSchema);
