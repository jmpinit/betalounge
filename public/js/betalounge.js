window.onload = function() {
	var game = {
		canvas: document.getElementById("screen"),
		creatures: [],
		add: function(creature, name) {
			if(name)
				creature.name = name;

			game.creatures[creature.name] = creature;
		}
	}

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

	function Human(x, y, sprite_sources) {
		this.name = "" + Math.random();
		this.x = x;
		this.y = y;

		this.animation = 'up';
		this.frame = 0;
		this.framecount = 2;

		// sprite loading
		var newman = this;
		load_images(sprite_sources, function(images) {
			newman.sprites = images;
			for(name in images) {
				newman.sprite = images[name][0];
				break;
			}
			newman.ready = true;
			console.log(newman.name + " is ready!");
		});
		
		this.ready = false;
		
		setInterval(function() { newman.animate(); }, 1000);
	}

	Human.prototype = {
		animate: function() {
			if(this.ready) {
				this.frame++;
				this.frame %= this.framecount;

				this.sprite = this.sprites[this.animation][this.frame];
			}
		}
	}

	game.add(new Human(1, 1, {
		up:	[
			"img/lounge/ash/ash_up1.png",
			"img/lounge/ash/ash_up2.png"
		],

		down: [
			"img/lounge/ash/ash_down1.png",
			"img/lounge/ash/ash_down2.png",
		],

		left: [
			"img/lounge/ash/ash_left1.png",
			"img/lounge/ash/ash_left2.png",
		],

		right: [
			"img/lounge/ash/ash_right1.png",
			"img/lounge/ash/ash_right2.png"
		]
	}), "player");

	function load_images(sources, callback) {
		var images = {};

		var to_load = 0;
		for(var i in sources)
			for(var j in sources[i])
				to_load++;

		var loaded = 0;
		for(anim_name in sources) {
			images[anim_name] = [];
			for(i in sources[anim_name]) {
				var img = new Image();

				img.onload = function() {
					if (++loaded >= to_load)
						callback(images);
				};
				img.src = sources[anim_name][i];

				images[anim_name].push(img);
			}
		}
	} 

	(function boot() {
		console.log("booting")
		animate();
	})();

	function animate() {
		requestAnimationFrame(animate);
		draw();
	}

	function draw() {
		var ctx = game.canvas.getContext('2d');
		
		ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
		for(var name in game.creatures) {
			var c = game.creatures[name];
			if(c.ready) ctx.drawImage(c.sprite, c.x, c.y);
		}
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
