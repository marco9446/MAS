var express = require('express');
var mongoose = require('mongoose');
var http=require('http');
var ip = require("ip");
var query = require("./query");
var io=function(){};
io.router=express.Router();
io.http=require('http');


Module = mongoose.model("Module");
Device = mongoose.model("Device");

var Queue=function(){ 
    var list=[];
    var timer=null;
    var callBack=function(a){
      console.log("maCane",a.ID,a.PARAM);
      var ID=a.ID;
      var message=a.PARAM;
      try{
          console.log("send message to ",ID,message);
          Module.findOne({_id:ID},function(err,found){
          if(found){

              var finalMsg="";
              for (i in message){
                  finalMsg+=Object.keys(message[i])[0].replace("in","")+"=";
                  finalMsg+=message[i][Object.keys(message[i])[0]]==true?"t&":"f&";
                  found.PORT[Object.keys(message[i])[0]].state=message[i][Object.keys(message[i])[0]];
                  found.markModified('PORT');
                  found.save();
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
      }catch(err){

        console.log(err);
     }}


     this.performQuery = function(elem){
        var helper={};
        for(var i = 0 ; i < list.length ; i++){
            if(list[i].ID == elem.ID){
              for( var l = 0;l<elem.PARAM.length;l++){
                  list[i].PARAM.push(elem.PARAM[l]);
              }
              return;
            }
        }
        list.push(elem);
     }

    //element = {ID:id,MESSAGE:msg}
    this.AddElement=function(elem){
      //OPTIMIZE THE ELEMENT ADDED
      console.log("add element")
      this.performQuery(elem);
      this.start();
    }

    var execute=function(){
      if(list.length >0){
            callBack(list[0]);
            list.splice(0,1);
            console.log("do elem in pos ",list.length,0);
             timer=setTimeout(function() {
              execute();
            },2000);
            console.log("run timeout");   
      }else{
         timer=null;
         console.log("no more element");
      }

    }
    this.start=function(){
        //TODO
        //Set timer that call execute function every time
        if(timer==null){
          console.log("no stuff restart all the timer")
          execute();
        }else{

          console.log("in coda")
        }

    }}



io.addNewModuleCallback=[];
io.addNewDeviceCallback=[];
io.logModuleCallback=[];
io.actionLinstener=[];
io.queue=new Queue();

io.router.post('/', function(req, res) {
  var b=req.body;
  var elem=Object.keys(b)[0];
  var ek1=JSON.parse(elem);
  io.queue.AddElement(ek1);
  res.status(200).end();
});



io.server1=http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
    req.on('end', function () {
      console.log(body);
      var content=body.split("\n");
      content[2]=content[2].replace(/(\r\n|\n|\r)/gm,"");
      query.getByNetId(content[2],function(err,found){
          if(found){
              var ip=content[1].replace(/(\r\n|\n|\r)/gm,""); 
              if(found.ip!=ip){
                //change IP
                query.changeIp({ip:ip},found,function(){});
              
              }
              //call calback
              console.log("mamma mia dammi cento lire che in america voglio andar")
              for(i in io.logModuleCallback.length){

                io.logModuleCallback[i](found);
              }

          }else{

              var ip=content[1].replace(/(\r\n|\n|\r)/gm,""); 
              var netID=content[2].replace(/(\r\n|\n|\r)/gm,""); 
              var type=content[3].replace(/(\r\n|\n|\r)/gm,"");

              query.addNewModule({ip:ip,type:type,netID:netID},function callBack(err,saved){ 
                  console.log(err,saved);
                  var arr= content[4].split(",");
                  for(var i in arr){
                      var pin="pin"+arr[i].substring(0,arr[i].indexOf('='));
                      var type=arr[i].substring(arr[i].indexOf('=')+1);

                      query.addNewDevice({pin:pin,type:type,state:false},function(err1,dSaved){
                      console.log(err1,dSaved);
                      for (var i in io.addNewDeviceCallback){
                            io.addNewDeviceCallback[i](dSaved);
                          }
                      console.log(saved._id)
                      query.pushDevices({id:dSaved._id},saved._id,function(err,upp){
                          for (var i in io.addNewModuleCallback){
                            io.addNewModuleCallback[i](upp);
                          }
                        });
                      });
                  }
                });
           }
        });
  });
}).listen(3005,ip.address());


io.server2=http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
    req.on('end', function () {
      console.log("asd");
      var ip=req.connection.remoteAddress;
      //ArduinoBase.findOne({IP:ip},function(err,found){
      query.getOneModuleByIp(ip,function(err,found){
      if(found){
        var elems=body.split(",");
        var change=[];
        //p2=t,p3=f,p4=t .....
        for(elem in elems){
            //make the incoming information more readble
            elems[elem]=elems[elem].replace("t",'true');
            elems[elem]=elems[elem].replace("f",'false');
            elems[elem]=elems[elem].replace("p",'pin');
            var pin = elems[elem].substring(1,elems[elem].indexOf(":")); 
            var state = elems[elem].substring(elems[elem].indexOf(":")+1,elems[elem].length-1);
            var p=function(p,s){
                var mPin=p;
                var mState=s;
                query.getOneDeviceFromArrayPin(found.devices,pin,function(err,found){
                    if(found){
                      if(found.state!=mState){
                          query.updateDevieState(found._id,mState,function(err,res){
                          console.log(res);
                          for (i in io.actionLinstener){
                                    io.actionLinstener[i](res);
                          } 
                          });
                      }
                    }
                });};
            p(pin,state);
        }          
      }
    });
    res.end();
    }
  );
}).listen(3015,ip.address());



module.exports = io;