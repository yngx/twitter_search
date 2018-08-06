var express = require("express");
var http = require("http");
var app = express();
var port = process.env.PORT || 3000;

var tweetCounts = require("./tweet_counter.js");

app.use(express.static(__dirname + "/client"));

http.createServer(app).listen(port);
console.log("Listening on port " + port);

app.get("/counts.json", function(req,res){
	res.json(tweetCounts);
});