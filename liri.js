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
	var omdbAPIURL = "http://omdbapi.com?t=" + movieTitle + "&r=json&tomatoes=true";

	// Requesting the information from OMDB
	request(omdbAPIURL, function (error, response, body) {
		// If no error, and response code is 200, which means works fine, then return the data. 


 		if (!error && response.statusCode == 200) {
			var movie = JSON.parse(body); 
			console.log("Movie Title: " + movie.Title);
			console.log("Year Released: " + movie.Year);
			console.log("IMDB Rating: " + movie.imdbRating);
			console.log("Country: " + movie.Country);
			console.log("Language Spoken: " + movie.Language);
			console.log("Movie Plot: " + movie.Plot);
			console.log("Actors: " + movie.Actors);
			console.log("Rotten Tomato Rating: " + movie.tomatoUserMeter);
			console.log("Rotten Tomato URL: " + movie.tomatoURL);
		}

		else{
  			console.log(error);
  		};

	});
}





