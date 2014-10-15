
var http = require('http');
var express = require('express');
var rules = require('./rules.js');
var db = require('./db.js');
var bodyParser = require('body-parser')

var app = express();
app.set('port', (process.env.PORT || 5000))

// New call to compress content
//app.use(express.compress());
app.use(express.static(__dirname + '/public/', {maxAge: 0}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use( bodyParser.urlencoded() ); // to support URL-encoded bodies

app.post('/ping', function(req, res) {
	res.send('Hello');
});

app.listen(app.get('port'), function() {
	console.log('Server listening to port ' + app.get('port'));
})

app.post('/user/:name', function(req, res) {
	var username = req.param('name');

	// Check if user exists
	db.User.findOne({username : name}, function(err, user) {
		if (user){
			console.log("User with name: " + name + " was found.");
			// TODO: send user as json
		} else {
			// TODO: send error
		}
	});
});

app.post('/user/create/', function(req, res) {
	var name = req.param('name');

	// Check if user exists
	db.User.find({username : name}, function(err, docs) {
		if (docs.length > 0){
			console.log("User with name: " + name + " was found.");
			res.send(name + " already exists!");
		} else {
			// Creating one user.
			var user = new User ({
			  username: name,
			  password: "1234"
			});

			// Saving it to the database.  
			user.save(function (err) {
				if (err) 
					res.error("ERROR");
				else 
					res.send( name + " was successfully created!" );
			});
		}
	});
});

app.post('/user/clear/', function(req, res) {
	// Clear out old data
	db.User.remove({}, function(err) {
		if (err) {
			console.log ('Error clearing users.');
			res.error('Error clearing users.');
		} else {
			res.send('Users successfully cleared.');
		}
	});
});

app.post('/game/user/:id', function(req, res) {
	var id = req.param('id');
	db.Game.find({p1 : id}, function(err, games){
		res.json(games);
	});
});

app.post('/game/create/', function(req, res) {

	console.log(req.body);
	var p1 = req.body.p1
    var p2 = req.body.p2;

	// TODO: Does players exist?

	var game = new db.Game({
		p1 : p1,
		p2 : p2,
		winner : "",
		gamestate : {
			turn : 0,
			playerToMove : p1,
			grid : [
				[' ',' ',' '],
				[' ',' ',' '],
				[' ',' ',' ']
			]
		}
	});

	// TODO: Respond with json
	game.save(function (err) {
		if (err) 
			res.error("ERROR");
		else 
			res.send("A game was successfully created with id " + game._id );
	});

});

app.post('/game/update/', function(req, res) {
	var gameId = req.param('game');
	var player = req.param('player');
	var action = req.param('action');

	db.Game.findOne({_id : gameId}, function(err, game) {
		if (game){
			console.log("Game found.");
			if (allowed(game, player, action)){
				update(game, action);
				// TODO: Respond with json
				game.save(function (err) {
					if (err) 
						res.error("ERROR");
					else 
						res.send("A game was successfully created with id " + game._id );
				});
			}
		} else {
			console.log("Game not found.");
			// TODO: Return repsonse
		}
	});
});

app.post('/game/:id', function(req, res) {
	var gameId = req.param('id');

	db.Game.findOne({_id : id}, function(err, game) {
		if (game){
			res.json(game);
		} else {
			res.error("Game not found.");
		}
	});
});

app.get('/game/', function(req, res) {

	db.Game.find({}, function(err, games) {
		if (games){
			console.log(games);
			res.json(games);
		} else {
			res.error("Game not found. " + err);
		}
	});
	
});


app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/'); // Derect to angular
});