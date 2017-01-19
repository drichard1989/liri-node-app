// We include the request packages for OMDB, Twitter, Spotify, and FShere.

var request = require("request");
var Twitter = require("twitter");
var Spotify = require("spotify");
var fs = require("fs");

// This sets the 3rd input on the command line to the sourceRequest variable.
var sourceRequest = process.argv[2];

// This sets the fourth input and on as the input for the sourceRequest. 
var input = "";
if (process.argv.length > 3){

	input = process.argv[3];

	for (i=4; i<process.argv.length; i++){
		input += " " + process.argv[i];
	}
}

// This creates a switch case for multiple requests from the same document, using the sourceRequest variable as the parameter that is fed in.
switch (sourceRequest){
	// Runs the returnTweets function if my-tweets is the sourceRequest
	case "my-tweets":
		returnTweets();
		break;

	// Runs the movieThis function if movie-this is the sourceRequest
	case "movie-this":
		movieThis();
		break;

	// Runs the spotifyThis function if spotify-this-song is the sourceRequest
	case "spotify-this-song":
		spotifyThis();
		break;

	// Runs the doWhatItSays function if do-what-it-says is the sourceRequest
	case "do-what-it-says":
		doWhatItSays();
		break;
} // This is the end of the switchCase for the sourceRequest


// This is the function that requests the information from OMDB using an API request.
function movieThis(){

	// Here we create a variable to be equal to whatever the content requested to be returned is.
	var movieTitle = input;	

	// Per the homework instructions, if there is no input, this makes the request equal to Mr. Nobody
	if(movieTitle === ""){
		movieTitle = "Mr. Nobody";
	}

	// Setting the variable for the API call  that integrates the movieTitle input as the search inquiry.
	var omdbAPIURL = "http://omdbapi.com?t=" + movieTitle + "&r=json&tomatoes=true";

	// Requesting the information from the OMDB API.
	request(omdbAPIURL, function (error, response, body) {

		// If no error, and response code is 200, which means works fine. Then, we set a variable named movieData, which will be continually added to with the content that we want returned, and at then end of the if statement, prints, and logs to the log.txt document. 
 		if (!error && response.statusCode == 200) {
			var movie = JSON.parse(body); 
			var movieData = "";

			var title = "Movie Title: " + movie.Title + "\n";
			movieData += title;

			var year = "Year Released: " + movie.Year + "\n";
			movieData += year;

			var rating = "IMDB Rating: " + movie.imdbRating + "\n";
			movieData += rating;

			var country = "Country: " + movie.Country + "\n";
			movieData += country;

			var language = "Country: " + movie.Language + "\n";
			movieData += language;

			var plot = "Movie Plot: " + movie.Plot + "\n";
			movieData += plot;

			var actors = "Actors: " + movie.Actors + "\n";
			movieData += actors;

			var tomatometer = "Rotten Tomato Rating: " + movie.tomatoUserMeter + "\n";
			movieData += tomatometer;

			var tomatourl = "RottenTomatoURL: " + movie.tomatoURL ;
			movieData += tomatourl;

			// Prints the movieData to the console
			console.log(movieData);

			// Logs the movieData to the log.txt file per the logData function defined below.
			logData(movieData);
		}

		// Logs an error if one exists.
		else{
  			console.log(error);
  		}

	}); //Closing tag for request OMDB
} //Closing OMDB Moviethis function


// This is the function that returns the data requested from the Twitter API.
function returnTweets() {
	
	// This pulls the keys from the keys.js file that were requested from Twitter.
	var twitterKeys = require("./keys.js").twitterKeys;

	// This re-assigns the values returned to variables to be used here.
	var consumer_key = twitterKeys.consumer_key;
	var consumer_secret = twitterKeys.consumer_secret;
	var access_token_key = twitterKeys.access_token_key;
	var access_token_secret = twitterKeys.access_token_secret;

	// This makes a new object 
	var client = new Twitter({
		consumer_key: consumer_key,
		consumer_secret: consumer_secret,
		access_token_key: access_token_key,
		access_token_secret: access_token_secret
	});

	// This requests that object using the queries integrated into the get method below. 
	client.get('search/tweets', {q: 'jtimberlake', count: 20}, function(error, tweets, response){

		// If error, return error.
		if(error){
			console.log(error);
			throw error;
		}

		// This is the else statement that will save the content to a variable, return the tweets on new lines for readability, then print it to the console, and then log it to the log.txt file.
		else{
			var tweetContent = "";
			for (i = 0; i < tweets.statuses.length; i++){
				tweetContent += '\n' + tweets.statuses[i].text + '\n';
			}
			// Prints the content of tweetContent
			console.log(tweetContent);
			// Logs the content  of tweetContent to the log.txt file
			logData(tweetContent);
		}
	});
} //Closing bracket for returnTweets function

function spotifyThis(){

	// Here we create a variable to be equal to whatever the content requested to be returned is.
	var songSelection = input;

	// Per the homework, if there is no inquiry input, then change the input to The Sign
	if (input === ""){
		songSelection = "The Sign";
	}

	// This is the request that searches for a track using the songSelection variable
	Spotify.search({ type: 'track', query: songSelection }, function(err, data) {
	    
	    // This logs the error if there is one.
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
 		
 		// This returns the data that we are asking for, concatinates it to be lines on top of one another for readability, and then prints and logs the data.
	    else{
	    	var songData = "";
	    	var songReturn = data.tracks.items[0];

	    	var artist = "Artist: " + songReturn.artists[0].name + "\n";
	    	songData += artist;

	    	var name = "Song Name: " + songReturn.name + "\n";
	    	songData += name;

	    	var preview = "Preview Link: " + songReturn.preview_url + "\n";
	    	songData += preview;

	    	var albumName = "Album Name: " + songReturn.album.name ;
	    	songData += albumName;

	    	// Prints the content of songData
	    	console.log(songData);
	    	// Logs the content of songData
	    	logData(songData);
	    }
	});
} // Closing bracket for spotifyThis function


// Function that looks at the random.txt file and integrates the text into the spotifyThis function if the do-what-it-says is sourceRequest.
function doWhatItSays() {
	//The code for the parameter do-what-it-says
	fs.readFile("random.txt", "utf8", function(err, data) {
		var dataArr = data.split(",");
		sourceRequest = dataArr[0];
		if (dataArr.length > 1) {
			input = dataArr[1];
		}
		spotifyThis();
	});
}

// This will take the data returned from each function and log it to the log.txt file.
function logData(info) {
	var date = new Date();
	var log = date + "\nnode liri.js " + sourceRequest + " " + input + "\n" + info + "\n" + "------------------" + "\n";
	fs.appendFile("log.txt", log, function(err) {
		if (err) {
			throw err;
		}
	});
}






