/**
 * Created by marcoravazzini on 21/11/14.
 */
function cinghiale() {
    console.log("dagsdgghvj");
    var cd = document.getElementById("sdv").value;
    document.getElementById("hh").value = cd;
}

addEventListener('drag-start', function(e) {
    var dragInfo = e.detail;
    //console.log(dragInfo.event.path[0]);
    // flaw #2: e vs dragInfo.event
    var color = dragInfo.event.target.style.backgroundColor;
    dragInfo.avatar.style.cssText = 'border: 3px solid ' + color + '; width: 32px; height: 32px; border-radius: 32px; background-color: whitesmoke';
    dragInfo.avatar.innerHTML =  "<div>ciao</div>";
    dragInfo.drag = function() {};
    dragInfo.drop = drop;

});
count =0;
function drop(dragInfo) {
    var color = dragInfo.avatar.style.borderColor;
    var dropTarget = dragInfo.event.relatedTarget;
    //chceck if the droptarget is the figure
    //

    console.log(dropTarget.offsetWidth);
    console.log(dragInfo.event.clientHeight);
    var f = dragInfo.framed;
    var d = document.createElement('div');
    d.className = 'dropped';
    d.onclick = function(event){

        var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        console.log(event.target);
        event.target.style.backgroundColor = hue;
    };
    d.style.left = (f.x *100)/dropTarget.offsetWidth + '%';
    d.style.top = (f.y* 100)/dropTarget.offsetHeight  + '%';
    //d.style.backgroundColor = color;

    dropTarget.appendChild(d);
    console.log(f);
    count++;
    if (count >= 6){
        dragInfo.event.path[0].parentNode.removeChild(dragInfo.event.path[0]);
    }
}

