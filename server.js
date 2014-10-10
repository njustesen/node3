var http = require('http');
var express = require('express');

var app = express();
var port = 5000;

app.set('port', (process.env.PORT || port))

// New call to compress content
//app.use(express.compress());
app.use(express.static(__dirname + '/public/', {maxAge: 0}));

app.post('/ping', function(req, res) {
	res.send('Hello');
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/'); // Derect to angular
});

console.log('Server listening to port ' + port);
