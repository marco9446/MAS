// 0. pridat include, boilerplate a knihovny
// 1. najit startovni node
// 2. najit na co navazuje (1. node)
// 3. smazat startovni, pracujeme s prvnim
// << FUNCTION
// 4. vzit node, zjistit typ
// 5a. podminka? 
// 	pridat if( s condition na VSECHNY podminky)
// 	zacala zavorka
// 	zavolej FUNCTION na YES
// 	skoncila zavorka
// 	5a.1
// 		existuje NO cesta?
// 		pridat else {
// 		zavolej FUNCTION na NO
// 		pridat }
// 	5a.2
// 		neexistuje NO cesta?
// 		pridat }

// 5b. akce?
// 	pridat action( );
// 	zavolej FUNCTION na NEXT

// 5c. cekani?
// 	pridat wait(hodnota);
// 	zavolej FUNCTION na NEXT

fs = require('fs');
output = "";

//whoaaaa
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

compile(variable);

//the interface for the library. basically call this to twerk
function compile(program) {
	var filename = "output.js";
	if (!program) {
		throw new Error("no program input to compile!");
		return undefined;
	}
	//add boilerplate
	output += addBoilerplate();

	//get START node
	var startNode = program.nodeDataArray.filter(function (obj) {
		return obj.text == "Start";
	})[0];

	exec(program, getNext(program, startNode));
	fs.writeFileSync(filename, output);

}

//get the node connected to this one
//this needs a shitload of testing I guess
function getNext(program, node, where) {
	if (!where) {
		var toKey = program.linkDataArray.filter(function (obj) {
			return obj.from == node.key;
		})[0];
		if (!toKey) {
			return undefined;
		}
		toKey = toKey.to;
		return program.nodeDataArray.filter(function (obj) {
			return obj.key == toKey;
		})[0];
	} else {
		var re = new RegExp(where, "g");
		var toKey = program.linkDataArray.filter(function (obj) {
			return ((obj.from == node.key) && (obj.fromPort.match(re)));
		})[0];
		if(!toKey) {
			return undefined;
		}
		toKey = toKey.to;
		return program.nodeDataArray.filter(function (obj) {
			return obj.key == toKey;
		})[0];
	}
}

function getConditions(program, node) {
	var condNode = program.nodeDataArray.filter(function (obj) {
		return ((obj.isGroup == true) && (obj.text == "Conditions") && (obj.group == node.key));
	})[0];
	var conditions = program.nodeDataArray.filter(function (obj) {
		return (obj.group == condNode.key);
	});
	return conditions;
}

//black magic
//this function basically does everything
//maybe except for cooking bacon and pancakes
//TO DO: in version 1.2, enable bacon and pancake functionality
// << FUNCTION
// 4. vzit node, zjistit typ
// 5a. podminka? 
// 	pridat if( s condition na VSECHNY podminky)
// 	zacala zavorka
// 	zavolej FUNCTION na YES
// 	skoncila zavorka
// 	5a.1
// 		existuje NO cesta?
// 		pridat else {
// 		zavolej FUNCTION na NO
// 		pridat }
// 	5a.2
// 		neexistuje NO cesta?
// 		pridat }

// 5b. akce?
// 	pridat action( );
// 	zavolej FUNCTION na NEXT

// 5c. cekani?
// 	pridat wait(hodnota);
// 	zavolej FUNCTION na NEXT
function exec(program, node) {
	if (!node)
		return 0;
	//if branch
	if (node.text == "IF") {
		execIfNode(program, node);
	} else if (node.text == "Delay") {
		//tady bude neco
		execDelay(program, node);
	} else {
		//action!
		execAction(program, node);
	}

};

//parse an If node
function execIfNode(program, node) {
	output += "if (";
	//conditions
	var conditions = getConditions(program, node);
	if (conditions.length < 1) {
		return undefined
	} else {
		output += "condition(";
		for (var i = 0; i < conditions.length; i++) {
			output += conditions[i].text;
			// , between arguments if this isn't the last one
			if (i != conditions.length-1)
				output += ", ";
		};
		output += ")";
	}
	//end of the bracket, start of curly bracket;
	output += ") {\n";
	//evaluate the YES branch
	exec(program, getNext(program, node, "yes"));
	output += "}";
	//if we have a NO branch
	if (getNext(program, node, "no")) {
		output += " else {\n";
		exec(program, getNext(program, node, "no"));
		output += "}";
	}
	output += "\n";
}

//parse an action node
function execAction(program, node) {
	output += "action(" + node.text + ");\n";
	if (getNext(program, node))
		exec(program, getNext(program, node));

}

//parse a delay node
function execDelay(program, node) {
	console.log("not implemented yet m8");
}



//add boilerplate bullshit to the generated code
//includes, use strict, "original content do not steal" and similar stuff belongs here
function addBoilerplate() {
	var output = "";
	output += "//THIS CODE WAS GENERATED BY BLACK MAGIC\n\n";
	output += "'use strict';\n";
	output += "require('./library');\n\n";
	return output;
}