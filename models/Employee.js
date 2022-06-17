const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const EmployeeSchema = new Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  phone: {type: Number, required: false},
  email: {type:String,required:false},
  password: { type: String, required: false },
  admin: {type: Boolean,default: false,required: true},
  deleted: {type: Boolean,default: false,required: true}
})
EmployeeSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
EmployeeSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Employee', EmployeeSchema);
