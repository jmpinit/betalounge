var express = require("express");
var app = express();

var port = 3700;

// jade settings
app.set('views', __dirname + '/templates');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
	res.render("index");
});
 
app.get("/", function(req, res){
	res.send("It works!");
});
 
app.listen(port);
console.log("Listening on port " + port);
