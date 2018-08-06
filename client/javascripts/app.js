"use strict"
var main = function() {
	var $span, count;

	count = 0;
	$span = $(".twitter-count");
	$span.text(count);

	$.getJSON("/counts.json", function(counts){
		$span.text(counts.awesome);
	});

	var insertToDOM = function (counts) {
		$span.text(counts.awesome);
	};

	
	setInterval(function() {
		$.getJSON("/counts.json", insertToDOM);
	}, 3000);
}

$(document).ready(main);