
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

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

app.post('/ping', function(req, res) {
	res.send('Hello');
});

app.listen(app.get('port'), function() {
	console.log('Server listening to port ' + app.get('port'));
})

app.post('/session/create/', function(req, res) {

	var data = req.body;
	var username = data.username;
    var password = data.password;

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

app.post('/users/', function(req, res) {

	console.log('/users/ called');

	db.User.find({}, function(err, users) {
		if (users){
			console.log(users.length + ' found.');
			res.json(users);
		} else {
			console.log(error);
			res.status(404).send('User not found');
		}
	});

});

/* TODO */
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
	var won = 0;
	var lost = 0;
	var draw = 0;

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
					  email : email,
					  won : won,
					  draw : draw,
					  lost : lost
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

app.post('/game/list/', function(req, res) {

	console.log('/game/ was called');
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

app.post('/game/get/:id', function(req, res) {

	console.log('/game/id was called');
	var id = req.param('id');
	console.log('/game/ was called with id: ' + id);
	
	db.Game.findOne({ _id : id }, function(err, game) {
		if (game){
			console.log("Game with id: " + id + " was found.");
			res.json(game);
		} else {
			res.status(404).send('Game not found.');
		}
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
							grid : "         "
						}
					});

					game.save(function (err3, game) {
						if (err) 
							res.status(404).send("Error creating the game!");
						else 
							res.json(game._id);
					});
				}
			});
		}
	});

});

app.post('/game/update/:id/', function(req, res) {

	var player = req.body.player;
	var action = req.body.action;

	var id = req.param('id');

	console.log('gameId: ' + id);
	console.log('player: ' + player);
	console.log('action: ' + action);

	db.Game.findOne({_id : id}, function(err, game) {
		if (game){
			console.log("Game found.");
			if (allowed(game, player, action)){
				console.log("Move allowed");
				update(game, action);
				console.log("Saving game");
				game.save();

				updateStats(game);

				res.json(game);

			} else {
				res.status(404).send("Move not allowed!");
			}
		} else {
			console.log("Game not found.");
			// TODO: Return repsonse
		}
	});
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/'); // Derect to angular
});

function updateStats(game){
	var winner = game.winner;
	var looser = '';
	var draw = false;
	var over = false;

	if (winner == game.p1){
		looser = game.p2;
		over = true;
	} else if (winner == game.p2){
		looser = game.p1;
		over = true;
	} else if (winner != ''){
		draw = true;
	}
	console.log('winner is ' + winner);
	console.log('looser is ' + looser);

	if (draw){
		console.log('game is a draw');
		db.User.findOne({ username : game.p1 }, function(err, user) {
			if (user){
				console.log('draw for ' + user.username);
				user.draw = user.draw + 1;
				user.save();
			}
		});
		db.User.findOne({ username : game.p2 }, function(err, user) {
			if (user){
				console.log('draw for ' + user.username);
				user.draw = user.draw + 1;
				user.save();
			}
		});
	} else if (over){
		db.User.findOne({ username : winner }, function(err, user) {
			if (user){
				console.log('won for ' + user.username);
				console.log(user.won);
				user.won = user.won + 1;
				console.log(user.won);
				user.save();
			}
		});
		db.User.findOne({ username : looser }, function(err, user) {
			if (user){
				console.log('loss for ' + user.username);
				console.log(user.lost);
				user.lost = user.lost + 1;
				console.log(user.lost);
				user.save();
			}
		});
	}
}

/*******************/

function update(game, action){
	console.log('### UPDATE ###');
	console.log(action);
	var grid = game.gamestate.grid;
	game.gamestate.grid = grid.replaceAt(action.y * 3 + action.x, action.token);
	game.gamestate.turn = game.gamestate.turn + 1;

	if (inRow(game, action.token)){
		console.log("Game Over!");
		if (action.token == 'x'){
			game.winner = game.p1;
			console.log('x won!');
		} else if (action.token == 'o'){
			game.winner = game.p2;
			console.log('o won!');
		}
		console.log(game.winner + ' won!');
		game.gamestate.playerToMove = null;
	} else if (game.gamestate.turn == 9){
		game.winner = null;
		game.gamestate.playerToMove = null;
	} else if (game.gamestate.playerToMove === game.p1){
		game.gamestate.playerToMove = game.p2;
	} else {
		game.gamestate.playerToMove = game.p1;
	}
	
	console.log(game.gamestate.grid);
	console.log('##############');
}

function allowed(game, player, action) {
	console.log('allowed called');
	if (game.winner === game.p1 
			|| game.winner === game.p2 
			|| game.winner === null){
		console.log('game is over');
		return false;
	}
	if (game.gamestate.playerToMove !== player){
		console.log('not ' + player + 's turn');
		return false;
	}

	if (game.p1 === player){
		console.log('player 1 (' + game.p1 + ') found -> ' + player);
		console.log('player 2 (' + game.p2 + ')');
		if (action.token !== 'x'){
			console.log('illegal token -> ' + action.token);
			return false;
		} else if (game.gamestate.grid.charAt(action.y*3 + action.x) != ' '){
			console.log('illegal square');
			return false;
		} else {
			console.log('action allowed');
			return true;
		}
	} else if (game.p2 === player){
		console.log('player 2 (' + game.p2 + ') found -> ' + player);
		console.log('player 1 (' + game.p1 + ')');
		if (action.token !== 'o'){
			console.log('illegal token -> ' + action.token);
			return false;
		} else if (game.gamestate.grid.charAt(action.y*3 + action.x) != ' '){
			console.log('illegal square');
			return false;
		} else {
			console.log('action allowed');
			return true;
		}
	}
	console.log('not allowed');
	return false;
}


function inRow(game, token){
	var size = 3;
	for(var y = 0; y < size; y++){
		var h = 0;
		for(var x = 0; x < size; x++){
			if (game.gamestate.grid.charAt(y*3+x) === token.charAt(0)){
				h++;
			}
		}
		if (h === size){
			return true;
		}
	}
	for(var x = 0; x < size; x++){
		var v = 0;
		for(var y = 0; y < size; y++){
			if (game.gamestate.grid.charAt(y*3+x) === token.charAt(0)){
				v++;
			}
		}
		if (v  === size){
			return true;
		}
	}
	for(var xy = 0; xy < size; xy++){
		var positive = 0;
		var negative = 0;
		if (game.gamestate.grid.charAt(xy*3 + xy) === token.charAt(0)){
			positive++;
		}
		if (game.gamestate.grid.charAt((size-xy-1)*3 + (size-xy-1)) === token.charAt(0)){
			negative++;
		}
		if (positive  === size || positive  === size){
			return true;
		}
	}
	return false;
}