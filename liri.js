// We include the request packages for OMDB and Twitter.

var request = require("request");
var Twitter = require("twitter");
var Spotify = require("spotify");


var sourceRequest = process.argv[2];
var input = process.argv[3];

for (i=4; i<process.argv.length; i++){
	input += " " + process.argv[i];
	};	

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
}


// This is the function that requests the information from OMDB
function movieThis(){
	// Setting the variable for URL integration
	var movieTitle = input;

	console.log(movieTitle);
	

	// Creating a for loop so I can input multiple word movie titles...
	

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
	})

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

		}
	})

}

function spotifyThis(){

	Spotify.search({ type: 'track', query: input }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    else{
    	console.log(data);
    	console.log(input);
    }
});
}





