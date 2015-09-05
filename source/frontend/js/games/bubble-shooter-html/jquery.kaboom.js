var $ = require('jquery');

(function (jQuery) {
	
	var defaults = {
		gravity: 1.3,
		maxY: 850
	};

	var toMove = [];

	jQuery.fn.kaboom = function (settings) {
		var config = $.extend({}, defaults, settings);
		if(toMove.length == 0) {
			setTimeout(moveAll, 80);
		}

		var dx = Math.round(Math.random() * 10) - 5;
		var dy = Math.round(Math.random() * 5) + 5;

		toMove.push({
			elm: this,
			dx: dx,
			dy: dy,
			x: this.position().left,
			y: this.position().top,
			config: config
		});
	};

	var moveAll = function() {
		var frameProportion = 1;
		var stillToMove = [];
		for(var i = 0; i < toMove.length; i++) {
			var obj = toMove[i];
			obj.x += obj.dx * frameProportion;
			obj.y -= obj.dy * frameProportion;
			obj.dy -= obj.config.gravity * frameProportion;

			if(obj.y < obj.config.maxY) {
				obj.elm.css({
					top: Math.round(obj.y),
					left: Math.round(obj.x)
				});

				stillToMove.push(obj);
			}
			else if(obj.config.callback) {
				obj.config.callback();
			}

		}
		toMove = stillToMove;
		if(toMove.length > 0) {
			setTimeout(moveAll, 40);
		}
	}
})($);