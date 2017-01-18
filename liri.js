// We include the request packages for OMDB and Twitter.

var request = require("request");
var Twitter = require("twitter");
var Spotify = require("spotify");
var fs = require("fs");


var sourceRequest = process.argv[2];

var input = "";

if (process.argv.length > 3){

	input = process.argv[3];

	for (i=4; i<process.argv.length; i++){
		input += " " + process.argv[i];
	}

}

// Lets create a switch case for multiple requests from the same document.

switch (sourceRequest){
	case "my-tweets":
		returnTweets();
		break;

	case "movie-this":
		movieThis();
		break;

	case "spotify-this-song":
		spotifyThis();
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;
}


// This is the function that requests the information from OMDB
function movieThis(){

	// Setting the variable for URL integration
	var movieTitle = input;	

	if(movieTitle === ""){
		movieTitle = "Mr. Nobody";
	}

	// Setting the variable for the API call 
	var omdbAPIURL = "http://omdbapi.com?t=" + movieTitle + "&r=json&tomatoes=true";

	// Requesting the information from OMDB
	request(omdbAPIURL, function (error, response, body) {
		// If no error, and response code is 200, which means works fine, then return the data. 

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

			console.log(movieData);
			logData(movieData);
		}

		else{
  			console.log(error);
  		}

	}); //Closing tag for request OMDB
} //Closing OMDB Moviethis function

function returnTweets() {
	
	// This pulls the keys from the keys.js file that were requested from Twitter.
	var twitterKeys = require("./keys.js").twitterKeys;

	// This re-assigns the values returned to variables to be used here.
	var consumer_key = twitterKeys['consumer_key'];
	var consumer_secret = twitterKeys['consumer_secret'];
	var access_token_key = twitterKeys['access_token_key'];
	var access_token_secret = twitterKeys['access_token_secret'];

	// This makes a new object 
	var client = new Twitter({
		consumer_key: consumer_key,
		consumer_secret: consumer_secret,
		access_token_key: access_token_key,
		access_token_secret: access_token_secret
	});

	client.get('search/tweets', {q: 'jtimberlake', count: 20}, function(error, tweets, response){

		if(error){
			console.log(error);
			throw error;
		}

		else{

			var tweetContent = "";
			for (i = 0; i < tweets.statuses.length; i++){
				tweetContent += '\n' + tweets.statuses[i].text + '\n';
			}
			console.log(tweetContent);
			logData(tweetContent);
		}
	});
} //Closing bracket for returnTweets function

function spotifyThis(){

	var songSelection = input;

	if (input === ""){
		songSelection = "The Sign";
	}

	Spotify.search({ type: 'track', query: songSelection }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
 
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

	    	console.log(songData);
	    	logData(songData);
	    }
	});
} // Closing bracket for spotifyThis function

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

function logData(info) {
	var date = new Date();
	var log = date + "\nnode liri.js " + sourceRequest + " " + input + "\n" + info + "\n" + "------------------" + "\n";
	fs.appendFile("log.txt", log, function(err) {
		if (err) {
			throw err;
		}
	});
}






