var mongoose = require('mongoose');
var Schema = mongoose.Schema;

ActivitySchema = new Schema({
name:String,
lat:Number,
lng:Number,
street:String,
city:String,
state:String,
zip_code:String,
place_id:String
});
var Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;
