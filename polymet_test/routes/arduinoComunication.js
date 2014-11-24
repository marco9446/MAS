var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var io=function(){};
var http=require('http');
var ip = require("ip");

io.http=require('http');


mongoose.connect("mongodb://localhost/" + "arduinoBaseConnection");
require("../model");
ArduinoBase = mongoose.model("ArduinoBase");

io.addNewDeviceCallback=[];
io.addDeviceCallback=[];
io.actionLinstener=[];


io.server1=http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  	req.on('end', function () {
  	console.log(body);
  
  	//check if arduino module arleady exists
  	var content=body.split("\n");
  	ArduinoBase.findOne({MAC:content[2].replace(/(\r\n|\n|\r)/gm,"")},function(err,found){
  		if(!err){
  				if(found){
  					
  						if(found.IP!=content[1].replace(/(\r\n|\n|\r)/gm,"")){
  							found.IP=content[1].replace(/(\r\n|\n|\r)/gm,"");
  							found.update(function(err){
  								for (i in io.addDeviceCallback){
  									io.addDeviceCallback[i](found);
  								}
  							});  							
  						}else{
								for (i in io.addDeviceCallback){
  									io.addDeviceCallback[i](found);
  								}
  						}
  				}else{
  						v1=ArduinoBase();
  						v1.MAC=content[2].replace(/(\r\n|\n|\r)/gm,"");
  						v1.IP=content[1].replace(/(\r\n|\n|\r)/gm,"");
  						var pinConfig = content[4].split(",");
              var resPinConfig={};
              for(i in pinConfig){
                  resPinConfig['pin'+pinConfig[i][0]]=JSON.parse('{"type":"'+pinConfig[i][2]+'","state":"false"}');
              }
              v1.TYPE=content[3].replace(/(\r\n|\n|\r)/gm,"");
              v1.PORT=resPinConfig;
  						v1.save(function(err){
  								for (i in io.addNewDeviceCallback){
  									io.addNewDeviceCallback[i](v1);
  								}
  							
  						});
  				}
  		}
  	});
  
   	res.end();
  	}
  );
}).listen(3005,ip.address());





io.server2=http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
    req.on('end', function () {
      var ip=req.connection.remoteAddress;
      ArduinoBase.findOne({IP:ip},function(err,found){
        if(found){
          var elems=body.split(",");
          var change={};
          for(elem in elems){
              elems[elem]=elems[elem].replace("t",'"true"');
              elems[elem]=elems[elem].replace("f",'"false"');
              elems[elem]=elems[elem].replace("p",'"pin');
              elems[elem]=elems[elem].replace(":",'":');
              var jsonElm=JSON.parse(elems[elem]);
              var elem=Object.keys(jsonElm)[0];
              if(found.PORT[elem].state==jsonElm[elem]){}
              else{
                change[elem]=jsonElm[elem];
                found.PORT[elem].state=jsonElm[elem];
                found.markModified('PORT');
                found.save();
              }
          }
          console.log(change);
          for (i in io.actionLinstener){
              io.actionLinstener[i](change);
          }           
      }
    });
    res.end();
    }
  );
}).listen(3015,ip.address());



//the message should be   a json with the state of the pin
//{pin1:true},{pin2:false}]
io.sendMessageTo=function(ID,message){
  console.log("asd");
  ArduinoBase.findOne({_id:ID},function(err,found){
      if(found){
        console.log(found);
        var finalMsg="";
        //TODO
        //UPDATE STATE OF ARDUINOOO !!!!!!!!!! Done <3
        for (i in message){
              finalMsg+=Object.keys(message[i])[0].replace("in","")+"=";
              finalMsg+=message[i][Object.keys(message[i])[0]]==true?"t&":"f&";
              found.PORT[Object.keys(message[i])[0]].state=message[i][Object.keys(message[i])[0]];
              found.markModified('PORT');
              found.save();
              //console.log(finalMsg);
        }
        found.save();
        var options = {
              host: found.IP,
              port: 80,
              path:finalMsg,
              method: 'GET'
            };

        http.get(options);
      }

  })
}


module.exports = io;