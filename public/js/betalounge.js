window.onload = function() {
	var game;

	var socket = io.connect('http://localhost:3700');

	var status = document.getElementById("status");
 
	socket.on('message', function (data) {
		if(data.message) {
			status.innerHTML = data.message;
		} else {
			console.log("There is a problem:", data);
		}
	});

	$(document.body).on('keydown', function(e) {
		console.log(e.which);
		switch (e.which) {
			case 87: // W
				socket.emit('send', { message: "up" });
			break;

			case 65: // A
				socket.emit('send', { message: "left" });
			break;

			case 83: // S
				socket.emit('send', { message: "down" });
			break;

			case 68: // D
				socket.emit('send', { message: "right" });
			break;
		}
	});

	load_images({
		ply_up1:	"img/lounge/ash/ash_up1.png",
		ply_up2:	"img/lounge/ash/ash_up2.png",

		ply_down1:	"img/lounge/ash/ash_down1.png",
		ply_down2:	"img/lounge/ash/ash_down2.png",

		ply_left1:	"img/lounge/ash/ash_left1.png",
		ply_left2:	"img/lounge/ash/ash_left2.png",

		ply_right1:	"img/lounge/ash/ash_right1.png",
		ply_right2:	"img/lounge/ash/ash_right2.png"
	}, boot);

	function load_images(sources, callback) {
		var images = {};

		var to_load = 0;
		for(var i in sources) to_load++;

		var loaded = 0;
		for(src_name in sources) {
			images[src_name] = new Image();
			images[src_name].onload = function() {
				if (++loaded >= to_load)
					callback(images);
			};
			images[src_name].src = sources[src_name];
		}
	} 

	function boot(images) {
		console.log("booting")

		game = {
			canvas: document.getElementById("screen"),
			sprites: images
		}

		animate();
	}

	function animate() {
		requestAnimationFrame(animate);
		draw();
	}

	function draw() {
		var ctx = game.canvas.getContext('2d');
		ctx.drawImage(game.sprites["ply_down1"], 0, 0);
	}

	// requestAnimFrame polyfill
	(function() {
		var lastTime = 0;
		var vendors = ['webkit', 'moz'];

		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame =
				window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
										   timeToCall);
										   lastTime = currTime + timeToCall;
										   return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}());
}
