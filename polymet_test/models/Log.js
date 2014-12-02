'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var LogSchema = new mongoose.Schema(
{
	time: {type: Date, required: true, default: Date.now},
	msg: {type: String, required: true},
	title: {type: String, required: true},

}
);


mongoose.model("Log", LogSchema);