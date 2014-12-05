/**
 * Created by marcoravazzini on 21/11/14.
 */

addEventListener('drag-start', function(e) {

    var dragInfo = e.detail;

    // flaw #2: e vs dragInfo.event
    if( dragInfo.event.target.className == "homepageDrug") {
        var id = dragInfo.event.target.id;
        dragInfo.avatar.style.cssText = 'border: 3px solid blue; width: 32px; height: 32px; border-radius: 32px; background-color: whitesmoke';
        dragInfo.avatar.id = id;
        dragInfo.drag = function () {
        };
        dragInfo.drop = drop;
    }else if( dragInfo.event.target.className.indexOf( "arduino_")>-1){
        var element = dragInfo.event.target;
        var elemId = element.parentElement.id;
        dragInfo.avatar.style.cssText = 'border: 3px solid blue;border-radius: 5px; width: 60px; height: 60px; background-color: #33d3e5';
        dragInfo.avatar.id = elemId;
        dragInfo.avatar.title = element.parentElement.title;
        dragInfo.avatar.className = dragInfo.event.target.className.substring(9);
        dragInfo.drag = function () {
        };
        dragInfo.drop = dropArduino;
    }else if(dragInfo.event.target.id =='if_block'||dragInfo.event.target.id =='condition_blockj' ){
        var element2 = dragInfo.event.target;
        console.log(dragInfo.event.target);
        dragInfo.avatar.style.cssText = 'border: 3px solid blue;border-radius: 5px; width: 70px; height: 90px; background-color: #ffdd33;';
        dragInfo.avatar.className = element2.id.substring(0,element2.id.indexOf("_"));
        dragInfo.avatar.title = element2.id.substring(0,element2.id.indexOf("_"));
        dragInfo.drag = function () {
        };
        dragInfo.drop = dropArduino;

    }else if(dragInfo.event.target.id =='delay_blockj' ){
        var element3 = dragInfo.event.target;
        console.log(dragInfo.event.target);
        dragInfo.avatar.style.cssText = 'border-radius: 5px; width: 70px; height: 90px; background: #33d3e5;border: 3px #0099CC solid;';
        dragInfo.avatar.className = element3.id.substring(0,element3.id.indexOf("_"));
        dragInfo.avatar.title = "delay 5";
        dragInfo.drag = function () {
        };
        dragInfo.drop = dropArduino;

    } else{
        console.log("wrong element");
    }
});

function drop(dragInfo) {

    var id = dragInfo.avatar.id;
    var dropTarget = dragInfo.event.relatedTarget;

    //chceck if the droptarget is the figur

    var f = dragInfo.framed;
    var d = document.createElement('div');
    d.className = 'dropped';
    d.id = id;
    var changePosition = dropTarget.querySelector("#changePosition");
    //changestate.body='{ "id" :"'+event.target.id+'" ,"status" :"switch"}';

    var x_position = (f.x *100)/dropTarget.offsetWidth;
    var y_position = (f.y* 100)/dropTarget.offsetHeight;
    d.style.left = x_position + '%';
    d.style.top = y_position  + '%';
    //d.style.backgroundColor = color;
    changePosition.url="/device/"+id;
    changePosition.body = '{"position":"'+JSON.stringify([x_position- 1 ,y_position])+'"}';

    dropTarget.appendChild(d);
    if (dropTarget.id == "blueprint-container") {
        dragInfo.event.path[0].parentNode.parentNode.removeChild(dragInfo.event.path[0].parentNode);
        changePosition.go();
    }
}

function dropArduino(draginfo){
    var id = draginfo.avatar.id;
    var type =draginfo.avatar.className;
    var name  = draginfo.avatar.title;
    var dropTarget = draginfo.event.relatedTarget;
    if(dropTarget.tagName == "CANVAS"){
        if (type == 'sensor'){
            newNode(id, name, "../GUI-Graphs/res/sensor.png", 'Sensor')
        }else if(type == 'button'){
            newNode(id, name, "../GUI-Graphs/res/button.png", 'Sensor')
        }else if(type == 'if'){
            newNode('', name.toUpperCase(), "", 'OfGroups')
        }else if(type == 'switch' ){
            newNode(id, name, "../GUI-Graphs/res/switch.png", 'Sensor')
        }else if(type == 'output' ){
            newNode(id, name, "../GUI-Graphs/res/lamp.png", '')
        }else if(type == 'delay' ){
            newNode('', name, "../GUI-Graphs/res/time.png", '')
        }

    }
}