
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

app.post('/session/create/', function(req, res) {

	var username = req.body.username;
    var password = req.body.password;

    console.log('create session called with usr: ' + username + ' psw: ' + password);

    db.User.findOne({ username : username }, function(err, user) {
    	console.log('db response');
		if (user && user.password === password){
			console.log('password correct');
			db.Session.findOne({ username : username }, function (err2, session){
				console.log('db response');
				if (session){
					console.log('session found: ' + session);
					res.json(session);
				} else {
					console.log('creating new session');
					var newSession = new db.Session({ username : username });
					newSession.save(function (err3) {
						console.log('db response');
						if (err) {
							console.log('Error saving session');
							res.status(404).send('Error signing in.');
						} else {
							console.log('Session saved');
							res.json(newSession);
						}
					});	
				}
			});
		} else if (user){
			res.status(404).send('Wrong password');
		} else {
			res.status(404).send('Username <u>' + username + '</u> does not exist');
		}
	});

});

app.post('/session/', function(req, res) {

	var sess = req.body;

    db.Session.findOne({ username : sess.username, _id : sess._id }, function(err, session) {
		if (session){
			res.json(session);
		} else {
			res.status(404).send('Session does not exist');
		}
	});

});

app.post('/session/delete', function(req, res) {

	var session_id = req.body;

    session.remove({_id : session_id}, function(err){
    	if (err){
    		res.status(404).send('Error deleting session.');
    	} else {
    		res.send('Success');
    	}
    });
	
});

app.post('/user/', function(req, res) {

	var username = req.body.username;

	// Check if user exists
	db.User.findOne({username : username}, function(err, user) {
		if (user){
			console.log("User with name: " + username + " was found.");
			res.json(user);
		} else {
			res.status(404).send('User not found');
		}
	});
});

app.post('/user/create/', function(req, res) {
	
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	console.log('trying to create user with email: ' + email);

	// Check if user exists
	db.User.find({username : username}, function(err, users) {
		if (users.length > 0){
			console.log("User with name: " + username + " was found.");
			res.status(404).send("<u>" + username + "</u> already exists!");
		} else {
			db.User.find({email : email}, function(err, users) {
				if (users.length > 0){
					console.log("User with email: " + email + " was found.");
					res.status(404).send(email + " is already used!");
				} else {
					// Creating one user.
					var user = new db.User ({
					  username : username,
					  password : password,
					  email : email
					});

					// Saving it to the database.  
					user.save(function (err) {
						if (err) 
							res.status(404).send("Error saving user!");
						else 
							res.send( username + " was successfully created!" );
					});
				}
			});
		}
	});
});

app.post('/user/clear/', function(req, res) {
	// Clear out old data
	db.User.remove({}, function(err) {
		if (err) {
			console.log ('Error clearing users.');
			res.status(404).send('Error clearing users.');
		} else {
			res.send('Users successfully cleared.');
		}
	});
});

app.post('/game/', function(req, res) {

	var username = req.body.username;
	console.log('looking for games with username ' + username);

	db.Game.find(
		{ 
			$or:[ { p1 : username }, { p2 : username } ] 
		}, 
		function(err, games){
			res.json(games);
		});
});

app.post('/game/create/', function(req, res) {

	var p1 = req.body.p1;
    var p2 = req.body.p2;

    if (p1 == p2){
		res.status(404).send('You cannot challenge yourself.');
		return;
    }

    db.User.findOne({ username : p1 }, function(err, userP1) {
		if (userP1 == null) {
			console.log ('Error challenging user ' + p2);
			res.status(404).send('User <u>' + p1 + '</u> does not exist.');
		} else {
			console.log('user found ' + userP1);
			db.User.findOne({ username : p2 }, function(err2, userP2) {
				if (userP2 == null) {
					console.log ('Error challenging user ' + p2);
					res.status(404).send('User <u>' + p2 + '</u> does not exist.');
				} else {
					console.log('user found ' + userP2);
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

					game.save(function (err3) {
						if (err) 
							res.status(404).send("Error creating the game!");
						else 
							res.json('Game successfully created!');
					});
				}
			});
		}
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
						res.status(404).send("Error saving game");
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
			res.status(404).send("Game not found.");
		}
	});
});

app.get('/game/', function(req, res) {

	db.Game.find({}, function(err, games) {
		if (games){
			res.json(games);
		} else {
			res.status(404).send("Game not found. " + err);
		}
	});
	
});


app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/'); // Derect to angular
});