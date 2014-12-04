var diagram;
function init() {
    //  if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;

    myDiagram =
        $(go.Diagram, document.querySelector("html /deep/ #test"),
            {
                allowDrop: true,
                // what to do when a drag-drop occurs in the Diagram's background
                mouseDrop: function (e) {
                    // when the selection is dropped in the diagram's background,
                    // make sure the selected Parts no longer belong to any Group
                    var ok = myDiagram.commandHandler.addTopLevelParts(myDiagram.selection, true);
                    if (!ok) myDiagram.currentTool.doCancel();
                },
                layout: $(go.GridLayout,
                    {
                        wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                        cellSize: new go.Size(1, 1)
                    }),
                initialContentAlignment: go.Spot.Center,
                groupSelectionAdornmentTemplate:  // this applies to all Groups
                    $(go.Adornment, go.Panel.Auto,
                        $(go.Shape, "Rectangle",
                            {fill: null, stroke: "dodgerblue", strokeWidth: 3}),
                        $(go.Placeholder)),
                "commandHandler.archetypeGroupData": {isGroup: true, category: "OfNodes"},
                "undoManager.isEnabled": true
            });
    diagram = myDiagram;

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.querySelector("html /deep/ #SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    // There are two templates for Groups, "OfGroups" and "OfNodes".
    // this function is used to highlight a Group that the selection may be dropped into
    function highlightGroup(e, grp, show) {
        if (!grp) return;
        e.handled = true;
        if (show) {
            // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
            // instead depend on the DraggingTool.draggedParts or .copiedParts
            var tool = grp.diagram.toolManager.draggingTool;
            var map = tool.draggedParts || tool.copiedParts;  // this is a Map
            // now we can check to see if the Group will accept membership of the dragged Parts
            if (grp.canAddMembers(map.toKeySet())) {
                grp.isHighlighted = true;
                return;
            }
        }
        grp.isHighlighted = false;
    }

    // upon a drop onto a Group, we try to add the selection as members of the Group;
    // if this is OK, we're done; otherwise we cancel the operation to rollback everything
    function finishDrop(e, grp) {
        var ok = grp !== null && grp.addMembers(grp.diagram.selection, true);
        if (!ok) grp.diagram.currentTool.doCancel();
    }

    var portSize = new go.Size(8, 8);
    var portMenu =  // context menu for each port
        $(go.Adornment, "Vertical",
            $("ContextMenuButton",
                $(go.TextBlock, "Remove port"),
                // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
                {
                    click: function (e, obj) {
                        removePort(obj.part.adornedObject);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "Change color"),
                {
                    click: function (e, obj) {
                        changeColor(obj.part.adornedObject);
                    }
                }),
            $("ContextMenuButton",
                $(go.TextBlock, "Remove side ports"),
                {
                    click: function (e, obj) {
                        removeAll(obj.part.adornedObject);
                    }
                })
        );
    myDiagram.groupTemplateMap.add("OfGroups",
        $(go.Group, go.Panel.Auto,
            {
                background: "transparent",
                // highlight when dragging into the Group
                mouseDragEnter: function (e, grp, prev) {
                    highlightGroup(e, grp, true);
                },
                mouseDragLeave: function (e, grp, next) {
                    highlightGroup(e, grp, false);
                },
                computesBoundsAfterDrag: true,
                // when the selection is dropped into a Group, add the selected Parts into that Group;
                // if it fails, cancel the tool, rolling back any changes
                mouseDrop: finishDrop,
                // Groups containing Groups lay out their members horizontally
                layout: $(go.GridLayout,
                    {
                        wrappingWidth: Infinity, alignment: go.GridLayout.Position,
                        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                    })
            },
            $(go.Panel, go.Panel.Vertical,
                $(go.Panel, "Horizontal",
                    new go.Binding("itemArray", "topArray"),
                    {
                        row: 0, column: 1,
                        itemTemplate: $(go.Panel,
                            {
                                _side: "top",
                                fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                                fromLinkable: true, toLinkable: true, cursor: "pointer",
                                contextMenu: portMenu
                            },
                            new go.Binding("portId", "portId"),
                            $(go.Shape, "Rectangle",
                                {
                                    stroke: null,
                                    desiredSize: portSize,
                                    margin: new go.Margin(0, 1)
                                },
                                new go.Binding("fill", "portColor"))
                        )  // end itemTemplate
                    }
                ),
                $(go.Panel, go.Panel.Horizontal,
                    {stretch: go.GraphObject.Horizontal, background: "#FFDD33"},
                    $("SubGraphExpanderButton",
                        {alignment: go.Spot.Right, margin: 5}),
                    $(go.TextBlock,
                        {
                            alignment: go.Spot.Left, editable: true,
                            margin: 5,
                            font: "bold 18px sans-serif",
                            stroke: "#9A6600"
                        },
                        new go.Binding("text", "text").makeTwoWay())
                ),  // end Horizontal Panel
                $(go.Placeholder,
                    {padding: 5, alignment: go.Spot.TopLeft},
                    new go.Binding("background", "isHighlighted", function (h) {
                        return h ? "red" : "transparent";
                    }).ofObject()
                ),
                $(go.Panel, go.Panel.Horizontal,
                    new go.Binding("itemArray", "bottomArray"),
                    {
                        itemTemplate: $(go.Panel,
                            {
                                _side: "bottom",  // internal property to make it easier to tell which side it's on
                                fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                                fromLinkable: true, toLinkable: true, cursor: "pointer",
                                contextMenu: portMenu
                            },
                            new go.Binding("portId", "portId"),
                            $(go.Shape, "Rectangle",
                                {
                                    stroke: null,
                                    desiredSize: portSize,
                                    margin: new go.Margin(5, 10)
                                },
                                new go.Binding("fill", "portColor"))
                        )  // end itemTemplate
                    }
                )
            ),  // end Vertical Panel
            $(go.Shape, "Rectangle",
                {
                    isPanelMain: true,  // the Rectangle Shape is in front of the Vertical Panel
                    fill: null,
                    stroke: "#E69900",
                    strokeWidth: 2
                })
        )
    );  // end Group and call to add to template Map

    myDiagram.groupTemplateMap.add("OfNodes",
        $(go.Group, go.Panel.Auto,
            {
                background: "transparent",
                ungroupable: true,
                // highlight when dragging into the Group
                mouseDragEnter: function (e, grp, prev) {
                    highlightGroup(e, grp, true);
                },
                mouseDragLeave: function (e, grp, next) {
                    highlightGroup(e, grp, false);
                },
                computesBoundsAfterDrag: true,
                // when the selection is dropped into a Group, add the selected Parts into that Group;
                // if it fails, cancel the tool, rolling back any changes
                mouseDrop: finishDrop,
                // Groups containing Nodes lay out their members vertically
                layout: $(go.GridLayout,
                    {
                        wrappingColumn: 1, alignment: go.GridLayout.Position,
                        cellSize: new go.Size(1, 1), spacing: new go.Size(4, 4)
                    })
            },
            $(go.Panel, go.Panel.Vertical,
                $(go.Panel, go.Panel.Horizontal,
                    {stretch: go.GraphObject.Horizontal, background: "#33D3E5"},
                    $("SubGraphExpanderButton",
                        {alignment: go.Spot.Right, margin: 2}),
                    $(go.TextBlock,
                        {
                            alignment: go.Spot.Left, editable: true,
                            margin: 5,
                            font: "bold 16px sans-serif",
                            stroke: "#006080"
                        },
                        new go.Binding("text", "text").makeTwoWay())
                ),  // end Horizontal Panel
                $(go.Placeholder,
                    {padding: 5, alignment: go.Spot.TopLeft},
                    new go.Binding("background", "isHighlighted", function (h) {
                        return h ? "red" : "transparent";
                    }).ofObject())
            ),  // end Vertical Panel
            $(go.Shape, "Rectangle",
                {
                    isPanelMain: true,
                    fill: null,
                    stroke: "#0099CC",
                    strokeWidth: 2
                })
        ));  // end Group and call to add to template Map

    // Nodes have a trivial definition -- the interesting thing is that it handles
    // the mouseDragEnter/mouseDragLeave/mouseDrop events and delegates them to the containing Group.
//------------------------------------AREA TO MERGE ---------------------------------------------------------//
//    myDiagram.nodeTemplate =
//        $(go.Node, go.Panel.Auto,
//            {
//                // highlight when dragging over a Node that is inside a Group
//                mouseDragEnter: function(e, nod, prev) { highlightGroup(e, nod.containingGroup, true); },
//                mouseDragLeave: function(e, nod, next) { highlightGroup(e, nod.containingGroup, false); },
//                // dropping on a Node is the same as dropping on its containing Group, if any
//                mouseDrop: function(e, nod) { finishDrop(e, nod.containingGroup); }
//            },
//            $(go.Shape, "Rectangle",
//                { fill: "#ACE600", stroke: "#558000", strokeWidth: 2 },
//                new go.Binding("fill", "color")),
//            $(go.TextBlock,
//                {   margin: 5, editable: true,
//                    font: "bold 13px sans-serif",
//                    stroke: "#446700"
//                },
//                new go.Binding("text", "text").makeTwoWay())
//        );

    myDiagram.nodeTemplate =
        $(go.Node, "Table",
            {
                locationObjectName: "BODY",
                locationSpot: go.Spot.Center,
                selectionObjectName: "BODY"
                //contextMenu: nodeMenu
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

            // the body
            $(go.Panel, "Auto",
                {
                    row: 1, column: 0, name: "BODY",
                    // highlight when dragging over a Node that is inside a Group
                    mouseDragEnter: function (e, nod, prev) {
                        highlightGroup(e, nod.containingGroup, true);
                    },
                    mouseDragLeave: function (e, nod, next) {
                        highlightGroup(e, nod.containingGroup, false);
                    },
                    // dropping on a Node is the same as dropping on its containing Group, if any
                    doubleClick: function (e, nod) {
                        myDiagram.model.addNodeData(nod);
                    },
                    mouseDrop: function (e, nod) {
                        finishDrop(e, nod.containingGroup);
                    }
                },
                $(go.Shape, "RoundedRectangle",
                    {
                        fill: "black",
                        minSize: new go.Size(56, 56)
                    },
                    new go.Binding("fill", "color")),
                $(go.Panel, "Horizontal",
                    $(go.Panel, "Auto",
                        $(go.Shape, "RoundedRectangle",
                            {fill: "#44CCFF"},
                            new go.Binding("fill", "color")
                        ),
                        $(go.Picture,
                            {margin: 10, width: 50, height: 50, background: "#44CCFF"},
                            new go.Binding("source"))
                    ),
                    $(go.Panel, "Vertical",
                        $(go.TextBlock,
                            {
                                textAlign: "center",
                                stroke: "white",
                                margin: 5, editable: true,
                                font: "bold 13px sans-serif"
                            },
                            new go.Binding("text", "text").makeTwoWay()),
                        $(go.TextBlock,
                            {margin: 10, textAlign: "center", stroke: "white"},
                            new go.Binding("text", "fun"))
                    )
                )
            )
            ,  // end Auto Panel body

            //    // the Panel holding the top port elements, which are themselves Panels,
            //    // created for each item in the itemArray, bound to data.topArray
            $(go.Panel, "Horizontal",
                new go.Binding("itemArray", "topArray"),
                {
                    row: 0, column: 0,
                    itemTemplate: $(go.Panel,
                        {
                            _side: "top",
                            fromSpot: go.Spot.Top, toSpot: go.Spot.Top,
                            fromLinkable: true, toLinkable: true, cursor: "pointer",
                            contextMenu: portMenu
                        },
                        new go.Binding("portId", "portId"),
                        $(go.Shape, "Rectangle",
                            {
                                stroke: null,
                                desiredSize: portSize,
                                margin: new go.Margin(0, 1)
                            },
                            new go.Binding("fill", "portColor"))
                    )  // end itemTemplate
                }
            ),  // end Horizontal Panel
            //

            //    // the Panel holding the bottom port elements, which are themselves Panels,
            //    // created for each item in the itemArray, bound to data.bottomArray
            $(go.Panel, "Horizontal",
                new go.Binding("itemArray", "bottomArray"),
                {
                    row: 2, column: 0,
                    itemTemplate: $(go.Panel,
                        {
                            _side: "bottom",
                            fromSpot: go.Spot.Bottom, toSpot: go.Spot.Bottom,
                            fromLinkable: true, toLinkable: true, cursor: "pointer",
                            contextMenu: portMenu
                        },
                        new go.Binding("portId", "portId"),
                        $(go.Shape, "Rectangle",
                            {
                                stroke: null,
                                desiredSize: portSize,
                                margin: new go.Margin(0, 1)
                            },
                            new go.Binding("fill", "portColor"))
                    )  // end itemTemplate
                }
            )  // end Horizontal Panel
        );  // end Node
    


    //link Template

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
                new go.Binding("stroke", "color"))  // just a plain black line
        );

    myDiagram.toolManager.clickCreatingTool.archetypeNodeData = {
        category: "OfGroups",
        isGroup: true,
        key: "Unit",
        leftArray: [{portId: "", portColor: ""}],
        rightArray: [],
        topArray: [],
        bottomArray: []
        // if you add data properties here, you should copy them in copyNodeData below
    };

    // initialize the Palette and its contents


    myPalette =
        $(go.Palette, document.querySelector("html /deep/ #myPalette"),
            {
                nodeTemplateMap: myDiagram.nodeTemplateMap,
                groupTemplateMap: myDiagram.groupTemplateMap,
                layout: $(go.GridLayout, { wrappingColumn: 1, alignment: go.GridLayout.Position })
            });
    myPalette.model = new go.GraphLinksModel([
        { text: "Conditions", isGroup:true, category:"OfNodes"},
        { text: "IF",isGroup:true,category:"OfGroups" ,color: "#FFDD33",  "bottomArray":[ {"portColor":"red", "portId":""},{"portColor":"green", "portId":""}] },
        { text: "Condition", color: "lightblue", source:"../GUI-Graphs/res/sensor.png" },
        {"text":"Lamp3",  "source":"../GUI-Graphs/res/lamp.png", "key":-78,"topArray":[{"portColor":"black", "portId":"from78"}], "bottomArray":[{"portcolor":"black", "pordId":"to78"}]},
        {"text":"Window1",  "source":"../GUI-Graphs/res/window.png", "key":15,"topArray":[{"portColor":"black", "portId":"from15"}],"bottomArray":[{"portcolor":"black", "pordId":"to15"}]}
    ]);

    //myPalette =
    //    $(go.Palette, document.querySelector("html /deep/ #myPalette"),
    //        {
    //            nodeTemplateMap: myDiagram.nodeTemplateMap,
    //            groupTemplateMap: myDiagram.groupTemplateMap,
    //            layout: $(go.GridLayout, { wrappingColumn: 1, alignment: go.GridLayout.Position })
    //        });
    //myPalette.model = new go.GraphLinksModel([
    //    { text: "Conditions", isGroup:true, category:"OfNodes"},
    //    { text: "IF",isGroup:true,category:"OfGroups" ,color: "#FFDD33",  "bottomArray":[ {"portColor":"red", "portId":""},{"portColor":"green", "portId":""}] },
    //    { text: "Condition", color: "lightblue", source:"../GUI-Graphs/res/sensor.png" },
    //    {"text":"Lamp3",  "source":"../GUI-Graphs/res/lamp.png", "key":-78,"topArray":[{"portColor":"black", "portId":"from78"}], "bottomArray":[{"portcolor":"black", "pordId":"to78"}]},
    //    {"text":"Window1",  "source":"../GUI-Graphs/res/window.png", "key":15,"topArray":[{"portColor":"black", "portId":"from15"}],"bottomArray":[{"portcolor":"black", "pordId":"to15"}]}
    //]);


    var slider = document.querySelector("html /deep/ #levelSlider");
    slider.addEventListener('change', reexpand);
    slider.addEventListener('input', reexpand);

    load();

}

function ciao(id, type){
    myDiagram.toolManager.clickCreatingTool.archetypeNodeData={
        category: type,
        isGroup:true,
        key: id,
        leftArray: [{portId:"",portColor:""}],
        rightArray: [],
        topArray: [],
        bottomArray: []
    }
}
//ciao("Unit","OfNodes");

function CustomLink() {
    go.Link.call(this);
};
go.Diagram.inherit(CustomLink, go.Link);

function expandGroups(g, i, level) {
    if (!(g instanceof go.Group)) return;
    g.isSubGraphExpanded = i < level;
    g.memberParts.each(function(m) {
        expandGroups(m, i + 1, level);
    })
}
function reexpand(e) {
    myDiagram.startTransaction("reexpand");
    var level = parseInt(document.querySelector("html /deep/ #levelSlider").value);
    myDiagram.findTopLevelGroups().each(function(g) { expandGroups(g, 0, level); })
    myDiagram.commitTransaction("reexpand");
}

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

function copyNodeData(data) {
    var copy = {};
    copy.key = data.key;  // adding to the Model will make the key value unique
    copy.loc = data.loc;
    copy.leftArray = copyPortArray(data.leftArray);
    copy.rightArray = copyPortArray(data.rightArray);
    copy.topArray = copyPortArray(data.topArray);
    copy.bottomArray = copyPortArray(data.bottomArray);
    copy.source = data.source;
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

// save a model to and load a model from Json text, displayed below the Diagram
function save() {
    document.querySelector("html /deep/ #mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}
function load() {
    myDiagram.model = go.Model.fromJson(document.querySelector("html /deep/ #mySavedModel").value);
}
init();

function cia() {
    console.log("entrato")
    diagram.model.addNodeData({
        category: "OfGroups",
        isGroup: true,
        key: "Unit",
        leftArray: [{portId: "", portColor: ""}],
        rightArray: [],
        topArray: [],
        bottomArray: []
        // if you add data properties here, you should copy them in copyNodeData below
    })
}
//cia();