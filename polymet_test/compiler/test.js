var compiler = require('./compiler');

var variable = { "class": "go.GraphLinksModel",
        "linkFromPortIdProperty": "fromPort",
        "linkToPortIdProperty": "toPort",
        "nodeDataArray": [
                {"key":1, "text":"IF", "isGroup":true, "category":"OfGroups", "bottomArray":[ {"portColor":"red", "portId":"no0"},{"portColor":"green", "portId":"yes0"} ], "topArray":[{"portColor":"#356853","portId":"fromStart0"}]},
        		{"key":2, "text":"Conditions", "isGroup":true, "category":"OfNodes", "group":1},
        		{"text":"Sensor1", "key":-7, "loc":"791.3023885139328 41.52284749830794", "group":2, "color":"lightblue", "source":"res/sensor.png"},
        		{"text":"Sensor2", "group":2, "key":-8, "loc":"87.77919515455794 110.34179281080793","color":"lightblue", "source":"res/sensor.png"},
        		{"text":"Start","source":"res/start.png", "key":-13, "loc":"450.7791951545578 200.34179281080796","bottomArray":[{"portColor":"black","portId":"start"}]},
        		{"key":-16, "loc":"619.3023885139328 339.34179281080816", "source":"res/lamp.png",  "text":"Lamp1", "leftArray":[ ], "topArray":[ {"portColor":"#d488a2", "portId":"top0"} ], "bottomArray":[ {"portColor":"#316571", "portId":"next0"} ], "rightArray":[ ]},
        		{"text":"Lamp2",  "source":"res/lamp.png", "key":-3, "loc":"88.84560140455795 200.34179281080796","topArray":[{"portColor":"black", "portId":"from0"}]},
        		{"text":"Lamp3",  "source":"res/lamp.png", "key":-25,"topArray":[{"portColor":"black", "portId":"from1"}]}
        ],
        "linkDataArray": [ {"from":1,"to":-25,"fromPort":"no0","toPort":"from1"},{"from":1, "to":-16, "fromPort":"yes0", "toPort":"top0", "points":[187.27919515455795,361.86464030911594,187.27919515455795,371.86464030911594,187.27919515455795,372,356,372,356,-12,716,-12,716,50.52284749830794,859,50.52284749830794,869,50.52284749830794]},{"from":-16,"to":-3,"fromPort":"next0","toPort":"from0"},{"from":-13, "to":1, "fromPort":"start", "toPort":"fromStart0"} ]};


console.log(compiler(variable));