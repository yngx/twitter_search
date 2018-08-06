var ntwitter = require("ntwitter");
var redis = require("redis");
var credentials = require("./credentials.json");
var twitter,redisClient, redisCredentials, services;
var counts = {};

var trackedWords = ["awesome", "cool", "rad"];

// set up our twitter object
twitter = ntwitter(credentials);
// create a client to connect to Redis

// initialize our counters
trackedWords.forEach(function (word) {
	counts[word] = 0;
});

if (process.env.VCAP_SERVICES) {
	services = JSON.parse(process.env.VCAP_SERVICES);
	redisCredentials = services["rediscloud"][0].credentials;
} else {
	redisCredentials = {
		"hostname" : "127.0.0.1",
		"port": "6379",
		"password": null
	};
}

redisClient = redis.createClient(redisCredentials.port, redisCredentials.hostname);
redisClient.auth(redisCredentials.password);

redisClient.get("awesome", function(err, awesomeCount) {
	if (err !== null) {
		console.log("Error: " + err);
		return;
	}

	counts.awesome = parseInt(awesomeCount,10) || 0
	// set up our twitter stream
	twitter.stream(
		"statuses/filter", 
		{ "track": "awesome" }, 
		function(stream) {
		  stream.on("data", function(tweet) {
		  	if (tweet.text.indexOf("awesome") > -1){
	      	redisClient.incr("awesome");
	      	counts.awesome = counts.awesome + 1;
	      	//console.log(tweet.text);
	      }	
		  });
		}
	);
});

/*
// set up our twitter stream
twitter.stream(
	"statuses/filter", 
	{ "track": trackedWords }, 
	function(stream) {
	  stream.on("data", function(tweet) {
	  	trackedWords.forEach(function (word) {
	  		if (tweet.text.indexOf(word) > -1){
      		redisClient.incr(word);
      		counts[word] = counts[word] + 1;
      		//console.log(tweet.text);
      	}	
	  	})
	  });
	}
);
*/

module.exports = counts;