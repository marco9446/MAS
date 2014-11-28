var data = { "class": "go.GraphLinksModel",
    "linkFromPortIdProperty": "fromPort",
    "linkToPortIdProperty": "toPort",
    nodeDataArray: [
        {"key":"Lamp 1", "loc":"101 204", source: "res/lamp.png", fun:"Device",
            "leftArray":[ {"portColor":"#425e5c", "portId":"left0"} ],
            "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ],
            "bottomArray":[ {"portColor":"#316571", "portId":"bottom0"} ],
            "rightArray":[ {"portColor":"#923951", "portId":"right0"},{"portColor":"#ef3768", "portId":"right1"} ] },
        {"key":"Button 2", "loc":"320 152", source: "res/lamp.png", group: "Lamp 1",
            "leftArray":[ {"portColor":"#7d4bd6", "portId":"left0"},{"portColor":"#cc585c", "portId":"left1"},{"portColor":"#b1273a", "portId":"left2"} ],
            "topArray":[ {"portColor":"#14abef", "portId":"top0"} ],
            "bottomArray":[ {"portColor":"#dd45c7", "portId":"bottom0"},{"portColor":"#995aa6", "portId":"bottom1"},{"portColor":"#6b95cb", "portId":"bottom2"} ],
            "rightArray":[  ] },
        {"key":"Button 3", "loc":"384 319", source: "res/lamp.png",
            "leftArray":[ {"portColor":"#bd8f27", "portId":"left0"},{"portColor":"#c14617", "portId":"left1"},{"portColor":"#47fa60", "portId":"left2"} ],
            "topArray":[ {"portColor":"#d08154", "portId":"top0"} ],
            "bottomArray":[ {"portColor":"#6cafdb", "portId":"bottom0"} ],
            "rightArray":[  ] },
        {"key":"Condition 1", "loc":"138 351", source: "res/lamp.png", group: "IF",
            "leftArray":[ {"portColor":"#491389", "portId":"left0"} ],
            "topArray":[  ],
            "bottomArray":[  ],
            "rightArray":[  ] },
        {"key":"Condition 2", "loc":"138 351", source: "res/lamp.png", group: "IF",
            "rightArray":[ {"portColor":"#491389", "portId":"left0"} ],
            "topArray":[  ],
            "bottomArray":[  ],
            "leftArray":[  ] },

        {"key":"True", "loc":"138 391", source: "res/lamp.png", group: "IF",
            "rightArray":[ {"portColor":"#491389", "portId":"left0"} ],
            "topArray":[  ],
            "bottomArray":[  ],
            "leftArray":[  ] },

        {"key":"False", "loc":"138 391", source: "res/lamp.png", group: "IF",
            "rightArray":[ {"portColor":"#491389", "portId":"left0"} ],
            "topArray":[  ],
            "bottomArray":[  ],
            "leftArray":[  ] },

        {"key":"IF", "loc":"101 204", source: "res/lamp.png", fun:"Device", isGroup:true,
            "leftArray":[ {"portColor":"#425e5c", "portId":"left0"} ],
            "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ],
            "bottomArray":[ {"portColor":"#316571", "portId":"bottom0"} ],
            "rightArray":[ {"portColor":"#923951", "portId":"right0"},{"portColor":"#ef3768", "portId":"right1"} ] },
    ],
    "linkDataArray": [
        {"from":"unit Four", "to":"unit One", "fromPort":"top0", "toPort":"bottom0",color:"green"},
        {"from":"unit Four", "to":"unit Two", "fromPort":"top0", "toPort":"bottom0",color:"red"},
        {"from":"unit Three", "to":"unit Two", "fromPort":"top0", "toPort":"bottom1"},
        {"from":"unit Four", "to":"unit Three", "fromPort":"right0", "toPort":"left0"},
        {"from":"unit Four", "to":"unit Three", "fromPort":"right1", "toPort":"left2"},
        {"from":"unit One", "to":"unit Two", "fromPort":"right0", "toPort":"left1"},
        {"from":"unit One", "to":"unit Two", "fromPort":"right1", "toPort":"left2"}
    ]};
//localStorage.setItem("data", JSON.stringify(data));
function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  //for conciseness in defining node templates

    myDiagram =
        $(go.Diagram, "test",  //Diagram refers to its DIV HTML element by id
            { initialContentAlignment: go.Spot.Center, "undoManager.isEnabled": true });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    var nodeMenu =  // context menu for each Node
        $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "Add top port"),
                { click: function (e, obj) { addPort("top"); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add left port"),
                { click: function (e, obj) { addPort("left"); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add right port"),
                { click: function (e, obj) { addPort("right"); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Add bottom port"),
                { click: function (e, obj) { addPort("bottom"); } })
        );

    var portSize = new go.Size(8, 8);

    var portMenu =  // context menu for each port
        $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "Remove port"),
                // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
                { click: function (e, obj) { removePort(obj.part.adornedObject); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Change color"),
                { click: function (e, obj) { changeColor(obj.part.adornedObject); } }),
            $("ContextMenuButton",
                $(go.TextBlock, "Remove side ports"),
                { click: function (e, obj) { removeAll(obj.part.adornedObject); } })
        );

    // the node template
    // includes a panel on each side with an itemArray of panels containing ports
    myDiagram.nodeTemplate =
        $(go.Node, "Table",
            { locationObjectName: "BODY",
                locationSpot: go.Spot.Center,
                selectionObjectName: "BODY",
                contextMenu: nodeMenu
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

            // the body
            $(go.Panel, "Auto",
                { row: 1, column: 1, name: "BODY"},
                $(go.Shape, "RoundedRectangle",
                    { fill: "black",
                        minSize: new go.Size(56, 56) }),
                $(go.Panel, "Horizontal",
                $(go.Panel, "Auto",
                    $(go.Shape, "RoundedRectangle",
                        {fill: "#44CCFF"},
                        new go.Binding("fill", "color")
                        ),
                    $(go.Picture,
                        { margin: 10, width: 50, height: 50, background: "#44CCFF" },
                        new go.Binding("source"))
                ),
                    $(go.Panel,"Vertical",
                        $(go.TextBlock,
                            { margin: 10, textAlign: "center",
                            stroke:"white" },
                            new go.Binding("text", "key")),
                        $(go.TextBlock,
                            {margin:10, textAlign:"center", stroke:"white"},
                            new go.Binding("text", "fun"))
                    )

                )

            ),  // end Auto Panel body

            // the Panel holding the left port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.leftArray
            $(go.Panel, "Vertical",
                new go.Binding("itemArray", "leftArray"),
                { row: 1, column: 0,
                    itemTemplate:
                        $(go.Panel,
                            { _side: "left",  // internal property to make it easier to tell which side it's on
                                fromSpot: go.Spot.Left, toSpot: go.Spot.Left,
                                fromLinkable: true, toLinkable: true, cursor: "pointer",
                                contextMenu: portMenu },
                            new go.Binding("portId", "portId"),
                            $(go.Shape, "Rectangle",
                                { stroke: null,
                                    desiredSize: portSize,
                                    margin: new go.Margin(1,0) },
                                new go.Binding("fill", "portColor"))
                        )  // end itemTemplate
                }
            ),  // end Vertical Panel

            // the Panel holding the top port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.topArray
            $(go.Panel, "Horizontal",
                new go.Binding("itemArray", "topArray"),
                { row: 0, column: 1,
                    itemTemplate:
                        $(go.Panel,
                            { _side: "top",
                                fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                                fromLinkable: true, toLinkable: true, cursor: "pointer",
                                contextMenu: portMenu },
                            new go.Binding("portId", "portId"),
                            $(go.Shape, "Rectangle",
                                { stroke: null,
                                    desiredSize: portSize,
                                    margin: new go.Margin(0, 1) },
                                new go.Binding("fill", "portColor"))
                        )  // end itemTemplate
                }
            ),  // end Horizontal Panel

            // the Panel holding the right port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.rightArray
            $(go.Panel, "Vertical",
                new go.Binding("itemArray", "rightArray"),
                { row: 1, column: 2,
                    itemTemplate:
                        $(go.Panel,
                            { _side: "right",
                                fromSpot: go.Spot.Right, toSpot: go.Spot.Right,
                                fromLinkable: true, toLinkable: true, cursor: "pointer",
                                contextMenu: portMenu },
                            new go.Binding("portId", "portId"),
                            $(go.Shape, "Rectangle",
                                { stroke: null,
                                    desiredSize: portSize,
                                    margin: new go.Margin(1, 0) },
                                new go.Binding("fill", "portColor"))
                        )  // end itemTemplate
                }
            ),  // end Vertical Panel

            // the Panel holding the bottom port elements, which are themselves Panels,
            // created for each item in the itemArray, bound to data.bottomArray
            $(go.Panel, "Horizontal",
                new go.Binding("itemArray", "bottomArray"),
                { row: 2, column: 1,
                    itemTemplate:
                        $(go.Panel,
                            { _side: "bottom",
                                fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                                fromLinkable: true, toLinkable: true, cursor: "pointer",
                                contextMenu: portMenu },
                            new go.Binding("portId", "portId"),
                            $(go.Shape, "Rectangle",
                                { stroke: null,
                                    desiredSize: portSize,
                                    margin: new go.Margin(0, 1) },
                                new go.Binding("fill", "portColor"))
                        )  // end itemTemplate
                }
            )  // end Horizontal Panel
        );  // end Node

    // an orthogonal link template, reshapable and relinkable
    myDiagram.linkTemplate =
        $(CustomLink,  // defined below
            {
                routing: go.Link.AvoidsNodes,
                corner: 4,
                curve: go.Link.JumpGap,
                reshapable: true,
                resegmentable: true,
                relinkableFrom: true,
                relinkableTo: true
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, {strokeWidth: 4},
            new go.Binding("stroke","color"))  // just a plain black line
        );

    // support double-clicking in the background to add a copy of this data as a node
    myDiagram.toolManager.clickCreatingTool.archetypeNodeData = {
        key: "Unit",
        leftArray: [],
        rightArray: [],
        topArray: [],
        bottomArray: []
        // if you add data properties here, you should copy them in copyNodeData below
    };

    // load the diagram from JSON data
    load();
}


// This custom-routing Link class tries to separate parallel links from each other.
// This assumes that ports are lined up in a row/column on a side of the node.
function CustomLink() {
    go.Link.call(this);
};
go.Diagram.inherit(CustomLink, go.Link);

CustomLink.prototype.findSidePortIndexAndCount = function(node, port) {
    var nodedata = node.data;
    var portdata = port.data;
    var side = port._side;
    var arr = nodedata[side + "Array"];
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (arr[i] === portdata) return [i, len];
    }
    return [-1, len];
};

/** @override */
CustomLink.prototype.computeEndSegmentLength = function(node, port, spot, from) {
    var esl = go.Link.prototype.computeEndSegmentLength.call(this, node, port, spot, from);
    var thispt = port.getDocumentPoint(this.computeSpot(from));
    var otherpt = this.getOtherPort(port).getDocumentPoint(this.computeSpot(!from));
    if (Math.abs(thispt.x - otherpt.x) > 20 || Math.abs(thispt.y - otherpt.y) > 20) {
        var info = this.findSidePortIndexAndCount(node, port);
        var idx = info[0];
        var count = info[1];
        if (port._side == "top" || port._side == "bottom") {
            if (otherpt.x < thispt.x) {
                return esl + 4 + idx * 8;
            } else {
                return esl + (count - idx - 1) * 8;
            }
        } else {  // left or right
            if (otherpt.y < thispt.y) {
                return esl + 4 + idx * 8;
            } else {
                return esl + (count - idx - 1) * 8;
            }
        }
    }
    return esl;
};

/** @override */
CustomLink.prototype.hasCurviness = function() {
    if (isNaN(this.curviness)) return true;
    return go.Link.prototype.hasCurviness.call(this);
};

/** @override */
CustomLink.prototype.computeCurviness = function() {
    if (isNaN(this.curviness)) {
        var fromnode = this.fromNode;
        var fromport = this.fromPort;
        var fromspot = this.computeSpot(true);
        var frompt = fromport.getDocumentPoint(fromspot);
        var tonode = this.toNode;
        var toport = this.toPort;
        var tospot = this.computeSpot(false);
        var topt = toport.getDocumentPoint(tospot);
        if (Math.abs(frompt.x - topt.x) > 20 || Math.abs(frompt.y - topt.y) > 20) {
            if ((fromspot.equals(go.Spot.Left) || fromspot.equals(go.Spot.Right)) &&
                (tospot.equals(go.Spot.Left) || tospot.equals(go.Spot.Right))) {
                var fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
                var toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
                var c = (fromseglen - toseglen) / 2;
                if (frompt.x + fromseglen >= topt.x - toseglen) {
                    if (frompt.y < topt.y) return c;
                    if (frompt.y > topt.y) return -c;
                }
            } else if ((fromspot.equals(go.Spot.Top) || fromspot.equals(go.Spot.Bottom)) &&
                (tospot.equals(go.Spot.Top) || tospot.equals(go.Spot.Bottom))) {
                var fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
                var toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
                var c = (fromseglen - toseglen) / 2;
                if (frompt.x + fromseglen >= topt.x - toseglen) {
                    if (frompt.y < topt.y) return c;
                    if (frompt.y > topt.y) return -c;
                }
            }
        }
    }
    return go.Link.prototype.computeCurviness.call(this);
};


// When copying a node, we need to copy the data that the node is bound to.
// This JavaScript object includes properties for the node as a whole, and
// four properties that are Arrays holding data for each port.
// Those arrays and port data objects need to be copied too.

function copyNodeData(data) {
    var copy = {};
    copy.key = data.key;  // adding to the Model will make the key value unique
    copy.loc = data.loc;
    copy.leftArray = copyPortArray(data.leftArray);
    copy.rightArray = copyPortArray(data.rightArray);
    copy.topArray = copyPortArray(data.topArray);
    copy.bottomArray = copyPortArray(data.bottomArray);
    copy.source = data.source;
    copy.fun=data.fun;
    // if you add data properties, you should copy them here too
    return copy;
}

function copyPortArray(arr) {
    var copy = [];
    if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
            copy.push(copyPortData(arr[i]));
        }
    }
    return copy;
}

function copyPortData(data) {
    var copy = {};
    copy.portId = data.portId;
    copy.portColor = data.portColor;
    // if you add port data properties, you should copy them here too
    return copy;
}


// Add a port to the specified side of the selected nodes.
function addPort(side) {
    myDiagram.startTransaction("addPort");
    myDiagram.selection.each(function(node) {
        // skip any selected Links
        if (!(node instanceof go.Node)) return;
        // compute the next available index number for the side
        var i = 0;
        while (node.findPort(side + i.toString()) !== node) i++;
        // now this new port name is unique within the whole Node because of the side prefix
        var name = side + i.toString();
        // get the Array of port data to be modified
        var arr = node.data[side + "Array"];
        if (arr) {
            // create a new port data object
            var newportdata = {
                portId: name,
                portColor: go.Brush.randomColor()
                // if you add port data properties here, you should copy them in copyPortData above
            };
            // and add it to the Array of port data
            myDiagram.model.insertArrayItem(arr, -1, newportdata);
        }
    });
    myDiagram.commitTransaction("addPort");
}

// Remove the clicked port from the node.
// Links to the port will be redrawn to the node's shape.
function removePort(port) {
    myDiagram.startTransaction("removePort");
    var pid = port.portId;
    var arr = port.panel.itemArray;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].portId === pid) {
            myDiagram.model.removeArrayItem(arr, i);
            break;
        }
    }
    myDiagram.commitTransaction("removePort");
}

// Remove all ports from the same side of the node as the clicked port.
function removeAll(port) {
    myDiagram.startTransaction("removePorts");
    var nodedata = port.part.data;
    var side = port._side;  // there are four property names, all ending in "Array"
    myDiagram.model.setDataProperty(nodedata, side + "Array", []);  // an empty Array
    myDiagram.commitTransaction("removePorts");
}

// Change the color of the clicked port.
function changeColor(port) {
    myDiagram.startTransaction("colorPort");
    var data = port.data;
    myDiagram.model.setDataProperty(data, "portColor", go.Brush.randomColor());
    myDiagram.commitTransaction("colorPort");
}


// Save the model to / load it from JSON text shown on the page itself, not in a database.
function save() {
    //document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    var newData=myDiagram.model.toJson();
    localStorage.setItem("data", newData);
    myDiagram.isModified = false;
}
function load() {
    myDiagram.model = go.Model.fromJson(JSON.parse(localStorage.getItem("data")));

    // link data includes the names of the to- and from- ports;
    // the GraphLinksModel needs to set these property names:
    // linkFromPortIdProperty and linkToPortIdProperty.

    // Customize the node data copying function
    // to avoid sharing of port data arrays and of the port data themselves.
    // (Functions cannot be written/read in JSON format.)
    myDiagram.model.copyNodeDataFunction = copyNodeData;
}

var arduinos= ["Arduino1","Arduino2","Arduino3","Arduino4","Arduino5"];
window.onload=function() {
    var ardList = document.getElementById("arduinos");
    var lst = "";
    for (var i in arduinos) {
        lst += "<div class='ardu'>" + arduinos[i] + "</div>"
    }
    ardList.innerHTML = lst;
    init();
};

function addIf(){
    var nodes = JSON.parse(localStorage.getItem("data"));
    console.log(nodes);
    var ifNode = {"key":"IF", "loc":"101 204", source: "res/lamp.png", fun:"Action",
            "leftArray":[ {"portColor":"red", "portId":"left0"} ],
            "topArray":[  ],
            "bottomArray":[  ],
            "rightArray":[ {"portColor":"green", "portId":"right0"} ] };
    console.log(ifNode);
    console.log(nodes.nodeDataArray);
    nodes.nodeDataArray.push(ifNode);
    localStorage.setItem("data", JSON.stringify(nodes));
}