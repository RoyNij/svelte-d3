/**
 * From Stack Overflow https://stackoverflow.com/a/3368118 solution 
 * by Juan Mendes https://stackoverflow.com/users/227299/juan-mendes
 * 
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke === 'undefined') {
	  stroke = true;
	}
	if (typeof radius === 'undefined') {
	  radius = 5;
	}
	if (typeof radius === 'number') {
	  radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
	  var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	  for (var side in defaultRadius) {
		radius[side] = radius[side] || defaultRadius[side];
	  }
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
	  ctx.fill();
	}
	if (stroke) {
	  ctx.stroke();
	}
}

/**
 * 
 * @param {Object} entity object with at least a numeric x and y property
 * @param {Object} reference object with at least a numeric x and y property
 * @param {Integer} radius collision radius to check against
 * 
 * @returns {Boolean} 
 */
export function detectCircularCollision( entity, reference, radius ){
	const dx = entity.x - reference.x
	const dy = entity.y - reference.y

	const dist = Math.sqrt( dx * dx + dy * dy )

	return dist < radius
}

export function detectBoxCollision( entity, box ){
	const inX = entity.x >= box.x && entity.x <= box.x + box.width;
	const inY = entity.y >= box.y && entity.y <= box.y + box.height;
	return inX && inY
}

export function getMousePosition( evt ){
	let clientX = evt.clientX || evt.touches[0].clientX
	let clientY = evt.clientY || evt.touches[0].clientY
	let boundingRect = evt.target.getBoundingClientRect();

	return [ clientX - boundingRect.left, clientY - boundingRect.top ];
}

export function Label( context, x, y, text, padding ){
	let _ctx = context,
		_x = x || 0,
		_y = y || 0,
		_padding = padding || {top: 5, right: 10, bottom: 5, left: 10},
		_text = text || "",
		_font = "sans-serif 10px",
		_align = "left",
		_bgColor = "#EAEAEA",
		_textColor = "#000000"

	draw.font = function( value ){
		if( value !== undefined ){
			_font = value;
			return draw;
		}
		return _font
	}

	draw.text = function( value ){
		if( value !== undefined ){
			_text = value;
			return draw;
		}
		return _text;
	}

	draw.x = function( value ){
		if( value !== undefined ){
			_x = value;
			return draw;
		}
		return _x
	}

	draw.y = function( value ){
		if( value !== undefined ){
			_y = value;
			return draw;
		}
		return _y
	}

	draw.align = function( value ){
		if( value !== undefined ){
			_align = value;
			return draw;
		}
		return _align
	}

	draw.textColor = function( value ){
		if( value !== undefined ){
			_textColor = value;
			return draw;
		}
		return _textColor;
	}

	draw.bgColor = function( value ){
		if( value !== undefined ){
			_bgColor = value;
			return draw;
		}
		return _bgColor;
	}

	draw.textWidth = function(){
		return _ctx.measureText( _text ).width;
	}

	draw.textHeight = function(){
		let dimensions = _ctx.measureText( _text )
		return dimensions.actualBoundingBoxAscent + dimensions.actualBoundingBoxDescent;
	}

	draw.boxWidth = function(){
		return draw.textWidth() + _padding.left + _padding.right;
	}
	
	draw.boxHeight = function(){
		return draw.textHeight() + _padding.top + _padding.bottom;
	}

	draw.box = function(){
		return {
			x: _align === "right" ? _x - draw.boxWidth() : _x,
			y: _y - 0.5 * draw.boxHeight(),
			width: draw.boxWidth(),
			height: draw.boxHeight()
		}
	}

	draw.padding = function( value ){
		if( value !== undefined ){
			_padding = value;
			return draw;
		}
		return _padding
	}

	function draw( ){
		_ctx.globalAlpha = 0.9
		
		let box = draw.box()

		roundRect( _ctx, box.x, box.y, box.width, box.height, 5, _bgColor )
		_ctx.globalAlpha = 1
		_ctx.fillStyle = _textColor
		_ctx.fillText( _text, box.x + _padding.left, _y + 0.8 * _padding.top )
	}

	return draw
}