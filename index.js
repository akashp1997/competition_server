const express = require("express");
const multer  = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json());
var upload = multer({ dest: 'images/' });
var teams = ["AUVSI", "adf", "agg", "ASV"];
var wstream = fs.createWriteStream('heartbeat.txt', {'flags': 'a'});

function followleader(request, response) {
	var path = request.path.split("/");
	if(path[2]!="courseA" && path[2]!="courseB" && path[2]!="courseC") {
		response.status(404).send();
		return;
	}
	if(teams.indexOf(path[3])==-1) {
		response.status(404).send();
		return;
	}
	var res = JSON.stringify({"status": "true"});
	var leng = (Buffer.byteLength(response.toString())+res.length).toString()
	response.set({"Content-Type": "application/json",
					"Content-Length": leng,
					"Server": "Jetty(8.0.4.v20111024)"});
	response.status(200).send(res);
	console.log("Got Follow Leader request from course: %s team: %s", path[2], path[3]);
}

function docking(request, response, next) {
	var path = request.path.split("/");
	if(path[3]!="courseA" && path[3]!="courseB" && path[3]!="courseC") {
		response.status(404).send();
		console.log("Hello");
		return;
	}
	if(teams.indexOf(path[4])==-1) {
		response.status(404).send();
		return;
	}
	var res = JSON.stringify({"id": request.file.filename});
	var leng = (Buffer.byteLength(response.toString())+res.length).toString()
	response.set({"Content-Type": "application/json",
					"Content-Length": leng,
					"Transfer-Encoding": "chunked"});
	response.status(202).send(res);
	console.log("Got Docking request from course: %s team %s", path[3], path[4])
	console.log("Filename: %s", request.file.path)
}

function heartbeat(request, response) {
	var path = request.path.split("/");
	if(path[2]!="courseA" && path[2]!="courseB" && path[2]!="courseC") {
		response.status(404).send();
		console.log("Hello");
		return;
	}
	if(teams.indexOf(path[3])==-1) {
		response.status(404).send();
		return;
	}
	//console.log(request.body);
	wstream.write(JSON.stringify(request.body)+"\n");
	var res = JSON.stringify({"success": true});
	var leng = (Buffer.byteLength(response.toString())+res.length).toString()
	response.set({"Content-Type": "application/json",
					"Content-Length": leng,
					"Server": "Jetty(8.0.4.v20111024)"});
	response.status(200).send(res);
}

function start(request, response) {
	var path = request.path.split("/");
	if(path[3]!="courseA" && path[3]!="courseB" && path[3]!="courseC") {
		response.status(404).send();
		console.log("Hello");
		return;
	}
	if(teams.indexOf(path[4])==-1) {
		response.status(404).send();
		return;
	}
	var res = JSON.stringify({"success": true});
	var leng = (Buffer.byteLength(response.toString())+res.length).toString()
	response.set({"Content-Type": "application/json",
					"Content-Length": leng,
					"Server": "Jetty(8.0.4.v20111024)"});
	response.status(200).send(res);
	console.log("Started a run for %s in %s", path[4], path[3]);
}

function end(request, response) {
	var path = request.path.split("/");
	if(path[3]!="courseA" && path[3]!="courseB" && path[3]!="courseC") {
		response.status(404).send();
		console.log("Hello");
		return;
	}
	if(teams.indexOf(path[4])==-1) {
		response.status(404).send();
		return;
	}
	var res = JSON.stringify({"success": true});
	var leng = (Buffer.byteLength(response.toString())+res.length).toString()
	response.set({"Content-Type": "application/json",
					"Content-Length": leng,
					"Server": "Jetty(8.0.4.v20111024)"});
	response.status(200).send(res);
	console.log("Ended a run for %s in %s", path[4], path[3]);

}

app.get("/followLeader/course*/[a-zA-z]{2,5}", followleader);

app.post("/docking/image/course*/[a-zA-z]{2,5}", upload.single("file"), docking);

app.post("/heartbeat/course*/[a-zA-z]{2,5}", heartbeat);

app.post("/run/start/course*/[a-zA-z]{2,5}", start);

app.post("/run/end/course*/[a-zA-z]{2,5}", end);

app.get("/*", function(request, response) {
	response.status(400).send("Your request is malformed");
});

app.listen(8080);
console.log("Server running at http://localhost:%d",8080);