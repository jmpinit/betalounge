var express = require("express");
var app = express();

var port = 3700;

// static server
app.use(express.static(__dirname + '/public'));

// socket.io setup
var io = require('socket.io').listen(app.listen(port));

// jade settings
app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
	res.render("index");
});
 
io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'server: hello there' });

	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});
 
console.log("Listening on port " + port);
