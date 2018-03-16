var mongoose = require('mongoose');
var Schema = mongoose.Schema;

UserSchema = new Schema({
first_name:String,
last_name:String,
email:String,
token:String,
type_connection:Number
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
