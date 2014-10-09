var http = require('http');
var express = require('express');

var app = express();
var port = 3000;

app.listen(port);

// New call to compress content
//app.use(express.compress());
app.use(express.static(__dirname + '/public/', {maxAge: 0}));

app.post('/ping', function(req, res) {
	res.send('Hello');
});

app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/'); // Derect to angular
});

console.log('Server running at http://127.0.0.1:' + port + '/');

function header(res){
	res.writeHead(200, {
		'Content-Type': mimeType,
		'Content-Length': contents.length,
		'Accept-Ranges': 'bytes',
		'Cache-Control': 'no-cache'
	});
	return res;
}