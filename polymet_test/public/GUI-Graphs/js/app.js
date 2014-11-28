//localStorage.clear()
function c(){
    var model = JSON.parse(localStorage.getItem("node"));
    model.push({ key: "7", parent: "2", name: "Lamp45", source: "res/lamp.png" });
    localStorage.setItem("node", JSON.stringify(model));
    myDiagram.model= new go.GraphLinksModel(JSON.parse(localStorage.getItem("node")), linkDataArray);}
function ba(){
    var DataArray=[{key: "1", name: "Arduino",source: "res/lamp.png"},
        {key: "2", name: "Lamp",source: "res/lamp.png"},
        {key: "3", name: "Sensor",source: "res/lamp.png"},
        {key: "1", name: "Tapparelle",source: "res/lamp.png"}];
    nodeDataArray=DataArray;
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);}
function ci(){console.log(myDiagram.model.toJson())}
var $ = go.GraphObject.make;

var myDiagram =
    $(go.Diagram, "test",
        {
            initialContentAlignment: go.Spot.Center, // Center Diagram contents
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
        });

// the template we defined earlier
myDiagram.nodeTemplate =
    $(go.Node, "Auto",
        $(go.Panel,"Auto", {background:"transparent"},
            $(go.Shape,"RoundedRectangle",{fill: "black",portId: "", cursor: "pointer",
                fromLinkable: true, toLinkable: true },
            new go.Binding("fill")),
            $(go.Panel,"Horizontal",
                $(go.Panel, "Auto",
                    $(go.Shape, "RoundedRectangle",
                        { fill: "#44CCFF"},
                        new go.Binding("fill", "color")),
                    $(go.Picture,
                        { margin: 10, width: 50, height: 50, background: "#44CCFF" },
                        new go.Binding("source"))),
                $(go.TextBlock, "Default Text",
                    { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
                    new go.Binding("text", "name")
                )
            )
        )
    );

// Define a Link template that routes orthogonally
myDiagram.linkTemplate =
    $(go.Link,
        { routing: go.Link.Orthogonal, corner: 5,relinkableFrom: true, relinkableTo: true },
        $(go.Shape,
            { strokeWidth: 3 },
            new go.Binding("stroke","color")),
        $(go.Shape,
            { toArrow: "Standard", stroke: null },
        new go.Binding("fill", "color"))
    ); // the link shape



var nodeDataArray =
    [
        { key: "1",              name: "Arduino",   source: "res/lamp.png", isGroup: true},
        { key: "2", group: "1", name: "Sensor1",    source: "res/lamp.png" },
        { key: "3", parent: "1", name: "Sensor2",   source: "res/lamp.png" },
        { key: "4", group: "1", name: "Lamp1", source: "res/lamp.png" },
        { key: "5", parent: "3", name: "Lamp2",     source: "res/lamp.png" },
        { key: "6", parent: "2", name: "Lamp3", source: "res/lamp.png" }
    ];
var linkDataArray =[
    {from: "1", to: "3", color:"green"}
];
//localStorage.setItem("node",JSON.stringify(nodeDataArray));
var arduinos= ["Arduino1","Arduino2","Arduino3","Arduino4","Arduino5"];
window.onload=function(){
    var ardList = document.getElementById("arduinos");
    var lst = "";
    for (var i in arduinos){
        lst += "<div class='ardu'>"+arduinos[i]+"</div>"
    }
    ardList.innerHTML=lst;
    myDiagram.model= new go.GraphLinksModel(JSON.parse(localStorage.getItem("node")), linkDataArray);
};

