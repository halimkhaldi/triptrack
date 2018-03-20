var mongoose = require('mongoose');
var Schema = mongoose.Schema;

PostSchema = new Schema({
title:{type:String,required: true},
description:String,
images:[String],
location_id:{type: Schema.Types.ObjectId, ref: 'Activity'},
user_id:{type: Schema.Types.ObjectId, ref: 'User',required:true},
trip_id:{type: Schema.Types.ObjectId, ref: 'Trip',required:true},
});
var Post = mongoose.model('Post', PostSchema);
module.exports = Post;
