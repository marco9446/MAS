// 0. pridat include, Header a knihovny
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


//the interface for the library. basically call this to twerk
var compile = function compile(program) {
	output = "";
	sensors = [];
	var filename = "code.js";
	if (!program) {
		throw new Error("no program input to compile!");
		return undefined;
	}
	//we don't add footer or header atm as the code is supposed to go into a generated function
	//and now we do!
	output += addHeader();

	//get START node
	var startNode = program.nodeDataArray.filter(function (obj) {
		return obj.text == "Start";
	})[0];

	//GO GO GADGET
	exec(program, getNext(program, startNode));

	//we don't add footer or header atm as the code is supposed to go into a generated function
	// output += addFooter();
	//save file
	return {code: output, sensors: sensors};

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
function exec(program, node) {
	var delayRE = new RegExp("delay", "g");
	if (!node)
		return 0;
	//if branch
	if (node.text == "IF") {
		execIfNode(program, node);
	} else if (node.text.match(delayRE)) {
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
		output += "library.condition(";
		output += "[";
		for (var i = 0; i < conditions.length; i++) {
			output += "'" + conditions[i].dbId + "'";
			// , between arguments if this isn't the last one
			if (i != conditions.length-1)
				output += ", ";
			//add condition to list of sensors!
			sensors.push(conditions[i].dbId);
		};
		output += "]"
		output += ")";
	}
	//end of the bracket, start of curly bracket;
	output += ") {\n";
	//evaluate the YES branch
	// output += "console.log('TOOK YES BRANCH')\n";
	exec(program, getNext(program, node, "yes"));
	output += "}";
	//if we have a NO branch
	if (getNext(program, node, "no")) {
		output += " else {\n";
		// output += "console.log('TOOK NO BRANCH')\n";
		exec(program, getNext(program, node, "no"));
		output += "}";
	}
	output += "\n";
}

//parse an action node
function execAction(program, node) {
	output += "library.action(" + "'" + node.dbId + "'" + ");\n";
	if (getNext(program, node))
		exec(program, getNext(program, node));

}

//parse a delay node
function execDelay(program, node) {
	//timeout is a fixed value for now, ten of something(?)
	var timeout = 2000;
	output += "setTimeout(function() {\n";
	exec(program, getNext(program, node));
	output += "}, " + timeout + ");\n";
}



//add Header bullshit to the generated code
//includes, use strict, "original content do not steal" and similar stuff belongs here
function addHeader() {
	var output = "";
	output += "dbase = db;\n"
	return output;
}

// function addFooter() {
// 	var output = "";
// 	output += "}\n\n";
// 	output += "module.exports = exec;\n\n"
// 	return output;
// }


module.exports = compile;
