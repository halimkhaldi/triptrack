var mongoose = require('mongoose');
var Schema = mongoose.Schema;

TripSchema = new Schema({
user_id:{ type: Schema.Types.ObjectId, ref: 'User' },
name:String,
description:String,
date_start:String,
date_end:String,
lat_start:Number,
lng_start:Number,
lat_end:Number,
lng_end:Number,
image_start:[String],
image_end:[String],
name_end:String,
description_end:String

});
var Trip = mongoose.model('Trip', TripSchema);
module.exports = Trip;
