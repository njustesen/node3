
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

    var userSchema = new mongoose.Schema({
		username: { type: String, index: true },
	    password: { type: String }
	});

	var sessionSchema = new mongoose.Schema({
		username: { type: String, index: true },
	    key: { type: String }
	});

	var gameSchema = new mongoose.Schema({
		p1 : { type: String },
		p2 : { type: String },
		winner : { type: String },
		gamestate: { 
			turn : { type: Number },
			playerToMove : { type: String },
			grid : { type : [] }
		}
	});

	// Add to the MongoDB database
	exports.User = mongoose.model('Users', userSchema);
	exports.Game = mongoose.model('Games', gameSchema);
	exports.Session = mongoose.model('Sessions', sessionSchema);
  }
});


