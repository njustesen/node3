
var mongoose = require ('mongoose');
var dbuser = 'noju';
var dbpassword = '11231123';
var dblocation = 'ds035740.mongolab.com:35740/heroku_app30558680';
var uristring = 'mongodb://' + dbuser + ':' + dbpassword + '@' + dblocation;

mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + uristring);

    var User = new mongoose.Schema({
		username: { type: String, index: true },
		email: { type: String },
	    password: { type: String },
    	won : { type : Number },
    	lost : { type : Number },
    	draw : { type : Number }
	});

	var Session = new mongoose.Schema({
		username: { type: String, index: true },
	    key: { type: String }
	});

	var Game = new mongoose.Schema({
		p1 : { type: String },
		p2 : { type: String },
		winner : { type: String },
		gamestate: {
			turn : { type: Number },
			playerToMove : { type: String },
			grid : { type: String }
		}
	});

	// Add to the MongoDB database
	exports.User = mongoose.model('User', User);
	exports.Game = mongoose.model('Game', Game);
	exports.Session = mongoose.model('Session', Session);

	console.log ('Successfully created collections');

  }
});


