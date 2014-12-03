'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var DesignSchema = new mongoose.Schema(
{
	name: {type: String, default: "new Design"},
	code: {type: String, required: true},
	program: {type: ObjectId, ref: "Program"}
}
);

mongoose.model("Design", DesignSchema);