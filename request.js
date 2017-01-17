// We include the request packages for OMDB and Twitter.

var request = require("request");
var Twitter = require("twitter");


var sourceRequest = process.argv[2];
var input = process.argv[3];

// Lets create a switch case for multiple requests from the same document.

switch (sourceRequest){
	case "twitter":
		tweetReturns();

		break;

	case "movie-this":
		movieThis();

		break;
}


// This is the function that requests the information from OMDB

function movieThis(){
	// Setting the variable for URL integration
	var movieTitle = "";
	

	// Creating a for loop so I can input multiple word movie titles...
	for (i=3; i<process.argv.length; i++){
	movieTitle = movieTitle + process.argv[i] + " ";
	};	

	if(movieTitle == ""){
		movieTitle = "Mr. Nobody";
	};

	// Setting the variable for the API call 
	var omdbAPIURL = "http://omdbapi.com?t=" + movieTitle + "&r=json";

	// Requesting the information from OMDB
	request(omdbAPIURL, function (error, response, body) {
		// If no error, and response code is 200, which means works fine, then return the data. 
		console.log("Movie Title: " + movieTitle);

 		if (!error && response.statusCode == 200) {
			var movie = JSON.parse(body); 
			console.log(movieTitle + " IMDB Rating: " + movie.imdbRating);
		}

		else{
  			console.log(error);
  		};

	});
}





