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

