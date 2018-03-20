var mongoose = require('mongoose');
var Schema = mongoose.Schema;

PostSchema = new Schema({
title:String,
description:String,
images:[String],
location_id:{type: Schema.Types.ObjectId, ref: 'Activity'},
user_id:{type: Schema.Types.ObjectId, ref: 'User'},
trip_id:{type: Schema.Types.ObjectId, ref: 'Trip'},
});
var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
