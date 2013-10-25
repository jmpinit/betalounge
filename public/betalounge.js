window.onload = function() {
	var socket = io.connect('http://localhost:3700');

	var btnUp = document.getElementById("up");
	var btnDown = document.getElementById("down");
	var btnLeft = document.getElementById("left");
	var btnRight = document.getElementById("right");

	var status = document.getElementById("status");
 
	socket.on('message', function (data) {
		if(data.message) {
			status.innerHTML = data.message;
		} else {
			console.log("There is a problem:", data);
		}
	});
 
	btnUp.onclick		= function() { socket.emit('send', { message: "up" }); };
	btnDown.onclick		= function() { socket.emit('send', { message: "down" }); };
	btnLeft.onclick		= function() { socket.emit('send', { message: "left" }); };
	btnRight.onclick	= function() { socket.emit('send', { message: "right" }); };
}
