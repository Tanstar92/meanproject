var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mongoroot:1955@cluster0.rae7squ.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: { type: String, required: false },
  password: { type: String },
  created_at: Date,
  updated_at: Date
});
var usersSchema = new Schema({
   email: { type: String, required: true },
   winWallet: Boolean,
   newsLetterSubscribe: Boolean,
   password: { type: String },
   ip: String,
   created_at: Date,
   updated_at: Date
   });
usersSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});
UserSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});


var User = mongoose.model('User', UserSchema);
module.exports.User = User;
module.exports.MeanUser = User;

