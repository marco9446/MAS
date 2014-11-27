'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var UserSchema = new mongoose.Schema(
{
	name: {type: String, required: true},
	password: {type: String, required: true}
}
);

mongoose.model("User", UserSchema);