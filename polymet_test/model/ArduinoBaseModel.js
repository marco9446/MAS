var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var ArduinoBaseModel = new mongoose.Schema(

{
  name : { type: String, required: true , default:"moduel" },
  IP : { type: String, required: true },
  MAC : { type: String, required: true },
  TYPE:{type:String,required:true},
  PORT:{type:Object,required:true},

});


//register model
mongoose.model('ArduinoBase', ArduinoBaseModel);
