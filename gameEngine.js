(function(){
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
	function drawCircle(ctx, x, y, r){
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
	};
	function drawEllipse(ctx, x, y, xr, yr){
	  var kappa = .5522848;
		  ox = xr * kappa, // control point offset horizontal
		  oy = yr * kappa, // control point offset vertical
		  xe = x + xr;       // x-end
		  ye = y + yr,       // y-end
		  xs = x - xr,       // x-start
		  ys = y - yr;       // y-start

	  ctx.beginPath();
	  ctx.moveTo(xs, y);
	  ctx.bezierCurveTo(xs, y - oy, x - ox, ys, x, ys);
	  ctx.bezierCurveTo(x + ox, ys, xe, y - oy, xe, y);
	  ctx.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
	  ctx.bezierCurveTo(x - ox, ye, xs, y + oy, xs, y);
	  ctx.closePath();
	};
	CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, radius){
		drawCircle(this, x, y, radius);
		this.stroke();
	};
	CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius){
		drawCircle(this, x, y, radius);
		this.fill();
	};
	CanvasRenderingContext2D.prototype.strokeEllipse = function(x, y, xr, yr) {
		drawEllipse(this, x, y, xr, yr);
		this.stroke();
	};
	CanvasRenderingContext2D.prototype.fillEllipse = function(x, y, xr, yr) {
		drawEllipse(this, x, y, xr, yr);
		this.fill();
	};
	Function.prototype.extend = function(name) {
		function Class() {
			if (!(this instanceof Class))
				throw('Constructor called without "new"');
			if ('_init' in this)
				this._init.apply(this, arguments);
			this.name = name;
		}
		Function.prototype.extend.nonconstructor.prototype = this.prototype;
		Class.prototype = new Function.prototype.extend.nonconstructor();
		return Class;
	};
	Function.prototype.extend.nonconstructor= function() {};
})();
// -----------------
// Define Components
// -----------------
var Vector = Object.extend();
(function(){
	function n(args){
		if(typeof args[0] == "Array")
			return args[0];
		return Array.prototype.slice.call(args);
	}
	Vector.prototype._init = function() {
		this.values = n(arguments);
		this.length = this.values.length;
	};
	Vector.prototype.toString = function(){
		return "["+this.values.join(",")+"]";
	};
	Vector.prototype.set = function() {
		var values = n(arguments);
		if(values.length == this.length) {
			this.values = values;
		}
		return this;

	};
	Vector.prototype.add = function() {
		var values = n(arguments);
		if(values.length == this.length) {
			for(var i = 0; i < this.length; i++)
				this.values[i] += values[i];
		}
		return this;
	};
	Vector.prototype.subtract = function() {
		var values = n(arguments);
		if(values.length == this.length) {
			for(var i = 0; i < this.length; i++)
				this.values[i] -= values[i];
		}
		return this;
	};
	Vector.prototype.scale = function(s) {
		for(var i = 0; i < this.length; i++)
			this.values[i] *= s;
		return this;
	};
	Vector.prototype.dot = function(vector) {
		if(!vector instanceof Vector)
			return;
		var values = vector.values,
			value = 0;
		if(values.length == this.length) {
			for(var i = 0; i < this.length; i++)
				value += this.values[i] * values[i];
		}
		return value;
	};
})();
var Vector2 = Vector.extend();
Vector2.prototype._init = function(x,y){
	if(arguments.length < 2){
		x = 0;
		y = 0;
	}
	this.x = x;
	this.y = y;
	this.length = 2;
};
Vector2.prototype.toString = function(){
	return "["+this.x.toFixed()+","+this.y.toFixed()+"]";
};
Vector2.prototype.clone = function() {
	return new Vector2(this.x, this.y);
};
Vector2.prototype.set = function(x,y) {
	if(arguments.length == 0){
		x = 0;
		y = 0;
	}
	else if(arguments[0] instanceof Vector2){
		y = arguments[0].y;
		x = arguments[0].x;
	}
	this.x = x;
	this.y = y;
	return this;

};
Vector2.prototype.add = function(x,y) {
	if(x instanceof Vector2){
		this.x += x.x;
		this.y += x.y;
	}
	else {
		this.x += x;
		this.y += y;
	}
	return this;
};
Vector2.prototype.subtract = function(x,y) {
	if(x instanceof Vector2){
		this.x -= x.x;
		this.y -= x.y;
	}
	else {
		this.x -= x;
		this.y -= y;
	}
	return this;
};
Vector2.prototype.scale = function(s) {
	this.x *= s;
	this.y *= s;
	return this;
};
Vector2.prototype.leftMultiply = function(matrix){
	if(matrix instanceof Matrix &&
		matrix.rows == 2 &&
		matrix.cols == 2){
		var newX = matrix.values[0][0] * this.x + matrix.values[0][1] * this.y,
			newY = matrix.values[1][0] * this.x + matrix.values[1][1] * this.y;
		this.x = newX;
		this.y = newY;
	}
	return this;
}
Vector2.prototype.normalise = function(){
	var mag = Math.sqrt(this.x*this.x + this.y*this.y);
	if(mag != 0){
		this.x /= mag;
		this.y /= mag;
	}
	return this;
};
Vector2.prototype.magnitude = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y);
};
Vector2.prototype.magnitude2 = function(){
	return this.x*this.x + this.y*this.y;
};
Vector2.prototype.angle = function(){
	return Math.atan2(this.x, this.y);
};
Vector2.prototype.cross = function(x,y) {
	if(x instanceof Vector2){
		y = x.y;
		x = x.x;
	}
	return this.x * y - this.y * x;
};
Vector2.prototype.dot = function(x,y) {
	if(x instanceof Vector2)
		return this.x * x.x + this.y * x.y;
	else
		return this.x * x + this.y * y;
};
Vector2.prototype.normal = function() {
	return (new Vector2(this.y, -this.x)).normalise();
};
Vector2.angleBetween = function(v1, v2) {
	return Math.atan2(v2.x - v1.x, v2.y - v1.y);
};
var Vector3 = Vector.extend();
Vector3.prototype._init = function(x,y,z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.length = 3;
};
Vector3.prototype.toString = function(){
	return "["+this.x+","+this.y+","+this.z+"]";
};
Vector3.prototype.cross = function(x,y,z) {
	if(x instanceof Vector3){
		var y = x.y,
			z = x.z,
			x = x.x;
	}
	return new Vector3(
		this.y * z - this.z * y,
		this.z * x - this.x * z,
		this.x * y - this.y * x);
};
Vector3.prototype.dot = function(x,y,z) {
	if(x instanceof Vector3){
		var y = x.y,
			z = x.z,
			x = x.x;
	}
	return this.x * x + this.y * y + this.z * z;
};
var Matrix = Object.extend();
Matrix.prototype._init = function(values){
	if(values.length > 1){
		var length = values[0].length,
			i = 1,
			l = values.length;
		for(;i<l;i++){
			if(values[i].length != length)
				break;
		}
		if(i != l)
			return;
		this.rows = l;
		this.cols = length;
	}
	else{
		this.rows = 1;
		this.cols = values[0].length;
	}
	this.values = values;
};
Matrix.prototype.toString = function() {
	var strs = [];
	for(var i = 0; i < this.rows; i++)
		strs[i] = "["+this.values[i].join(",")+"]";
	return strs.join("\n");
};
Matrix.prototype.add = function(matrix) {
	if(matrix instanceof Matrix &&
		this.rows == matrix.rows &&
		this.cols == matrix.cols){
		for(var i = 0; i < this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.values[i][j] += matrix[i][j];
			}
		}
	}
	return this;
};
Matrix.prototype.subtract = function(matrix) {
	if(matrix instanceof Matrix &&
		this.rows == matrix.rows &&
		this.cols == matrix.cols){
		for(var i = 0; i < this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.values[i][j] -= matrix[i][j];
			}
		}
	}
	return this;
};
Matrix.prototype.scale = function(factor) {
	for(var i = 0; i < this.rows; i++){
		for(var j = 0; j < this.cols; j++){
			this.values[i][j] *= factor;
		}
	}
	return this;
};
Matrix.prototype.det = function() {
	if(this.rows == 2 &&
		this.cols == 2){
		return this.values[0][0]*this.values[1][1] - this.values[0][1]*this.values[1][0];
	}
};
Matrix.prototype.inverse = function(){
	if(this.rows == 2 &&
		this.cols == 2 &&
		this.det() != 0){
		var v = this.values;
		return (new Matrix([[v[1][1],-v[0][1]],[-v[1][0],v[0][0]]])).scale(1/this.det());
	}
};
Matrix.prototype.multiply = function(matrix) {
	var values = [];
	if(matrix instanceof Matrix &&
		this.rows == matrix.cols &&
		this.cols == matrix.rows){
		for(var i = 0; i < this.rows; i++){
			values[i] = [];
			for(var j = 0; j < matrix.cols; j++){
				var value = 0;
				for(var k = 0; k < this.cols; k++)
					value += this.values[i][k] * matrix.values[k][j];
				values[i][j] = value;
			}
		}
	}
	return new Matrix(values);
};
Matrix.rotationMatrix = function(theta){
	return new Matrix([
		[Math.cos(theta),-Math.sin(theta)],
		[Math.sin(theta), Math.cos(theta)]
	]);
};
Matrix.scaleMatrix = function(sx,sy){
	if(arguments.length == 1)
		sy = sx;
	return new Matrix([
		[sx,0],
		[0, sy]
	]);
};
Matrix.shearMatrix = function(thetax,thetay){
	if(arguments.length == 1)
		thetay = 0;
	return new Matrix([
		[1, Math.tan(thetax)],
		[Math.tan(thetay), 1]
	]);
};
var GameObject = Object.extend("GameObject");
GameObject.prototype._init = function(x, y){
	this.components = [];
	this.position = new Vector2(x, y);
	this.velocity = new Vector2();
	this.rotation = 0;
	this.toBeRemoved = [];
	this.life = 1;
	this.team = 0;
};
GameObject.prototype.addComponent = function(component){
	if(component instanceof GameComponent)
		this.components.push(component);
	return this;
};
GameObject.prototype.removeComponent = function(component){
	this.toBeRemoved.push(component);
	return this;
}
GameObject.prototype.removeComponentByName = function(name){
	for(var i = 0; i < this.components.length; i++){
		if(this.components[i].name == name)
			this.toBeRemoved.push(this.components[i]);
	}
	return this;
}
GameObject.prototype.removeComponentByTest = function(test){
	for(var i = 0; i < this.components.length; i++){
		if(test(this.components[i]))
			this.toBeRemoved.push(this.components[i]);
	}
	return this;
}
GameObject.prototype.setPosition = function(x,y) {
	this.position.set(x,y);
	return this;
};
GameObject.prototype.setVelocity = function(vx,vy) {
	this.velocity.set(vx, vy);
	return this;
};
GameObject.prototype.setRotation = function(th) {
	this.rotation = th;
	return this;
};
GameObject.prototype.hit = function(victim) {
	if(this.hitVictim == null)
		this.hitVictim = victim;
};
GameObject.prototype.hitBy = function(attacker) {
	if(this.attackerHit == null)
		this.attackerHit = attacker;
};
GameObject.prototype.update = function(delta){
	var i = 0,
		l = this.components.length,
		j = 0,
		m = this.toBeRemoved.length;
	for(;j<m;j++){
		for(i=0;i<l;i++){
			if(this.components[i] == this.toBeRemoved[j]){
				this.components.remove(i);
				break;
			}
		}
	}
	this.toBeRemoved = [];
	l = this.components.length;
	for(i=0;i<l;i++){
		this.components[i].update(this, delta);
	}
};
GameObject.prototype.toHTML = function() {
	var html = this.name;
	if(typeof this.position.x == "number")
		html += " " + this.position;
	if(this.components.length){
		html += "<ul>";
		for(var i=0;i<this.components.length;i++)
			html += "<li>"+this.components[i].toHTML();
		html += "</ul>";
	}
	return html;
};
var GameObjectManager = GameObject.extend("GameObjectManager");
GameObjectManager.prototype._init = function(){
	GameObject.prototype._init.call(this);
	this.objects = [];
	this.objectsToBeRemoved = [];
};
GameObjectManager.prototype.addObject = function(object){
	if(object instanceof GameObject)
		this.objects.push(object);
	return this;
};
GameObjectManager.prototype.addObjectAt = function(index, object){
	if(object instanceof GameObject)
		this.objects.splice(index,0,object);
	return this;
};
GameObjectManager.prototype.removeObject = function(object){
	if(object instanceof GameObject)
		this.objectsToBeRemoved.push(object);
	return this;
};
GameObjectManager.prototype.update = function(delta){
	var i = 0,
		l = this.objects.length,
		m = this.objectsToBeRemoved.length,
		j = 0;

	for(i=0;i<l;i++){
		if(this.objects[i].life)
			this.objects[i].update(delta);
		else
			this.removeObject(this.objects[i]);
	}

	for(;j<m;j++){
		i = 0;
		for(;i<l;i++){
			if(this.objects[i] == this.objectsToBeRemoved[j]){
				this.objects.remove(i);
				l--;
				break;
			}
		}
	}
	this.toBeRemoved = [];
};
GameObjectManager.prototype.toHTML = function() {
	var html = this.name;
	if(this.objects.length > 1)
		html += " (" + this.objects.length + " items)";
	if(this.components.length){
		html += "<ul>";
		for(var i=0;i<this.components.length;i++)
			html += "<li>"+this.components[i].toHTML();
		html += "</ul>";
	}
	if(this.objects.length){
		html += "<ul>";
		for(var i=0;i<this.objects.length;i++)
			html += "<li>"+this.objects[i].toHTML();
		html += "</ul>";
	}
	return html;
};

var CanvasManager = GameObject.extend("CanvasManager");
CanvasManager.prototype._init = function(context){
	GameObject.prototype._init.call(this);
	this.context = context;
};
CanvasManager.prototype.update = function(delta){
	width = this.context.canvas.width = this.context.canvas.offsetWidth;
	height = this.context.canvas.height = this.context.canvas.offsetHeight;
}
var GameComponent = Object.extend("GameComponent");
GameComponent.prototype.update = function(parent, delta){};
GameComponent.prototype.toHTML = function() {
	return this.name;
};
var MoveComponent = GameComponent.extend("MoveComponent");
MoveComponent.prototype._init = function() {
	this.delta = new Vector2();
};
MoveComponent.prototype.update = function(parent, delta) {
	this.delta.set(parent.velocity).scale(delta);
	parent.position.add(this.delta);
};
var DrawBallComponent = GameComponent.extend("DrawBallComponent");
DrawBallComponent.prototype._init = function(size, colour){
	this.size = size;
	this.colour = colour;
};
DrawBallComponent.prototype.update = function(parent, delta) {
	GameObject.sRenderSystem.fillCircle(parent.position.x,parent.position.y,this.size,this.colour);
	GameObject.sRenderSystem.fillCircle(parent.position.x+this.size*0.33,parent.position.y-this.size*0.33,this.size*0.45,"rgba(255,255,255,0.7)");
};
var DrawPolygonComponent = GameComponent.extend("DrawPolygonComponent");
DrawPolygonComponent.prototype._init = function(coords, colour, fill){
	this.coords = coords;
	this.colour = colour;
	this.fill = fill;
	this.vec = new Vector2();
};
DrawPolygonComponent.prototype.update = function(parent, delta) {
	var i=0,
		l = this.coords.length-1,
		path = [];
	for(;i<l;i+=2){
		this.vec.set(this.coords[i],this.coords[i+1]);
		this.vec.leftMultiply(Matrix.rotationMatrix(parent.rotation));
		this.vec.add(parent.position);
		path.push(this.vec.x, this.vec.y);
	}
	GameObject.sRenderSystem.strokePath(path,this.colour);
};
var DebugDrawPathComponent = GameComponent.extend("DebugDrawPathComponent");
DebugDrawPathComponent.prototype._init = function(object){
	this.path = [];
	this.pathSize = 1000;
	this.pathIndex = 0;
	this.lastVx = 0;
	this.lastVy = 0;
	if(object instanceof GameObject)
		this.relativeTo = object.position;
	else
		this.relativeTo = new Vector2();
};
DebugDrawPathComponent.prototype.update = function(parent, delta) {
	if(DEBUG){
		// Draw Path
		var skip = this.pathIndex % this.pathSize,
			path = [parent.position.x, parent.position.y];
		if(this.pathIndex > this.pathSize){
			for(var i = this.pathSize-1;i>=0;i--){
				var index = (i + skip + this.pathSize) % this.pathSize;
				path.push(this.path[index][0]+this.relativeTo.x,this.path[index][1]+this.relativeTo.y);
			}
		}else{
			for(var i = this.pathIndex-1;i>=0;i--){
				path.push(this.path[i][0]+this.relativeTo.x,this.path[i][1]+this.relativeTo.y);
			}
		}
		if(this.relativeTo.x)
			GameObject.sRenderSystem.strokePath(path,"#CCF");
		else
			GameObject.sRenderSystem.strokePath(path,"#CCC");
		this.pathIndex++;
		this.path[skip] = [parent.position.x-this.relativeTo.x,parent.position.y-this.relativeTo.y];

		// Draw Velocity
		GameObject.sRenderSystem.strokePath([parent.position.x, parent.position.y,
			parent.position.x+parent.velocity.x*100, parent.position.y+parent.velocity.y*100],
			"rgba(0,128,255,0.7)");

		// Draw Acceleration
		var ax = (parent.velocity.x - this.lastVx)/delta,
			ay = (parent.velocity.y - this.lastVy)/delta;
		this.lastVx = parent.velocity.x;
		this.lastVy = parent.velocity.y;
		GameObject.sRenderSystem.strokePath([parent.position.x, parent.position.y,
			parent.position.x+ax*4e5, parent.position.y+ay*4e5],
			"rgba(0,255,0,0.7)");
	}else{
		this.pathIndex = 0;
	}
};
var WorldBounceComponent = GameComponent.extend("WorldBounceComponent");
WorldBounceComponent.prototype._init = function(width, height, roomWidth, roomHeight) {
	this.ax = width / 2;
	this.ay = height / 2;
	this.bx = roomWidth - this.ax;
	this.by = roomHeight - this.ay;
};
WorldBounceComponent.prototype.update = function(parent, delta) {
	var coef = 0.9;
	if(parent.position.x < this.ax){
		parent.position.x = this.ax;
		parent.velocity.x = -parent.velocity.x*coef;
	}
	else if(parent.position.x > this.bx){
		parent.position.x = this.bx;
		parent.velocity.x = -parent.velocity.x*coef;
	}
	if(parent.position.y < this.ay){
		parent.position.y = this.ay;
		parent.velocity.y = -parent.velocity.y*coef;
	}
	else if(parent.position.y > this.by){
		parent.position.y = this.by;
		parent.velocity.y = -parent.velocity.y*coef;
	}
};
var WorldWrapComponent = GameComponent.extend("WorldWrapComponent");
WorldWrapComponent.prototype._init = function(roomWidth, roomHeight) {
	this.ax = 0;
	this.ay = 0;
	this.bx = roomWidth - this.ax;
	this.by = roomHeight - this.ay;
};
WorldWrapComponent.prototype.update = function(parent, delta) {
	if(parent.position.x < this.ax){
		parent.position.x = this.bx;
	}
	else if(parent.position.x > this.bx){
		parent.position.x = this.ax;
	}
	if(parent.position.y < this.ay){
		parent.position.y = this.by;
	}
	else if(parent.position.y > this.by){
		parent.position.y = this.ay;
	}
};
var GravityComponent = GameComponent.extend("GravityComponent");
GravityComponent.prototype.update = function(parent, delta) {
	if(typeof parent.velocity.y == "undefined")
		parent.velocity.y = 0;
	parent.velocity.y += 0.0001*delta;
};
var RandomMoveComponent = GameComponent.extend("RandomMoveComponent");
RandomMoveComponent.prototype.update = function(parent, delta) {
	if(Math.random()<0.001)
		parent.velocity.set(Math.random()-0.5, Math.random()-0.5);
};
var PointGravityComponent = GameComponent.extend("PointGravityComponent");
PointGravityComponent.prototype._init = function(target) {
	this.target = target;
	this.vector = new Vector2();
};
PointGravityComponent.prototype.update = function(parent, delta) {
	var vec = this.vector.set(this.target.position).subtract(parent.position),
		scalar = this.target.mass*delta/vec.magnitude2();
	vec.normalise();
	vec.scale(scalar);
	parent.velocity.add(vec);
};
PointGravityComponent.referencesTest = function(object){
	return function(testComponent){
		return testComponent instanceof PointGravityComponent &&
			testComponent.target == object;
	};
};
var GeneralRelativityPointGravityComponent = GameComponent.extend("GeneralRelativityPointGravityComponent");
GeneralRelativityPointGravityComponent.prototype._init = function(target) {
	this.target = target;
	this.vectorA = new Vector2();
	this.vectorB = new Vector2();
};
GeneralRelativityPointGravityComponent.prototype.update = function(parent, delta) {
	var r = this.vectorA.set(parent.position).subtract(this.target.position),
		v = this.vectorB.set(parent.velocity),
		G = 1,
		M = this.target.mass,
		r2 = r.magnitude2(),
		r3 = Math.pow(r.magnitude(),3),
		v1 = v.magnitude(),
		c2 = 325334.92879081, // <- this number here actually ties all units to real world
		newtonian = - G*M / r2,
		relativity = - 3*G*M / (r3 * c2) * v.dot(r);
	// just re-use r here
	r.normalise();
	r.scale(newtonian);
	// This line is part of GR calculations
	v.scale(relativity);
	r.add(v);
	r.scale(delta);
	parent.velocity.add(r);
};
GeneralRelativityPointGravityComponent.referencesTest = function(object){
	return function(testComponent){
		return testComponent instanceof GeneralRelativityPointGravityComponent &&
			testComponent.target == object;
	};
};
var CollisionComponent = GameComponent.extend("CollisionComponent");
CollisionComponent.prototype._init = function(width, height) {
	this.halfWidth = width / 2;
	this.halfHeight = height / 2;
};
CollisionComponent.prototype.update = function(parent, delta) {
	var bounds = [
		parent.position.x - this.halfWidth,
		parent.position.y - this.halfHeight,
		parent.position.x + this.halfWidth,
		parent.position.y + this.halfHeight
	];
	GameObject.sCollisionSystem.addCollisionBounds(parent, bounds, bounds);
};
var CollisionSystem = GameObject.extend("CollisionSystem");
CollisionSystem.prototype._init = function() {
	GameObject.prototype._init.call(this);
	this.attackBounds = [];
	this.vulnerableBounds = [];
};
CollisionSystem.prototype.update = function(delta) {
	GameObject.prototype.update.call(this,delta);

	var i = 0,
		l = this.attackBounds.length,
		j,
		m = this.vulnerableBounds.length,
		collision = false,
		attack, vulnerable;
	for(; i < l; i++){
		attack = this.attackBounds[i];
		for(j=0; j < m; j++){
			vulnerable = this.vulnerableBounds[j];
			if(attack.object != vulnerable.object &&
				attack.bounds[2] >= vulnerable.bounds[0] &&
				attack.bounds[0] <= vulnerable.bounds[2] &&
				attack.bounds[3] >= vulnerable.bounds[1] &&
				attack.bounds[1] <= vulnerable.bounds[3])
			{
				attack.object.hit(vulnerable.object);
				vulnerable.object.hitBy(attack.object);
				// break; here?
			}
		}
	}
	this.attackBounds = [];
	this.vulnerableBounds = [];
};
CollisionSystem.prototype.addCollisionBounds = function(object, attackBounds, vulnerableBounds){
	// These should be added sorted!!
	if(attackBounds && attackBounds.length)
		this.attackBounds.push({object: object, bounds: attackBounds});
	if(vulnerableBounds && vulnerableBounds.length)
		this.vulnerableBounds.push({object: object, bounds: vulnerableBounds});
};
/**
 * Submit surfaces to BackgroundSystem
 */
var SolidComponent = GameComponent.extend("SolidComponent");
SolidComponent.prototype._init = function(lineSegments) {
	this.segments = lineSegments;
};
SolidComponent.prototype.update = function(parent, delta) {
	var lines = [],
		i = 0,
		l = this.segments.length,
		j, m,
		seg, line;
	for(;i<l;i++){
		seg = this.segments[i];
		m = seg.length-1;
		line = []
		for(j=0;j<m;j+=2){
			line.push(seg[j]+parent.position.x, seg[j+1]+parent.position.y);
		}
		lines.push(line);
	}
	GameObject.sBackgroundSystem.addTemporarySurfaces(lines);
};
var DebugDrawBoundsComponent = GameComponent.extend("DebugDrawBoundsComponent");
DebugDrawBoundsComponent.prototype._init = function(context){
	this.context = context;
}
DebugDrawBoundsComponent.prototype.update = function(parent, delta) {
	if(DEBUG){
		var bounds = GameObject.sCollisionSystem.getBounds();
		for(var i=0;i<bounds.length;i++){
			var bound = bounds[i];
			GameObject.sRenderSystem.strokeRect(bound[0],bound[1],bound[2]-bound[0],bound[3]-bound[1],"#999");
		}
	}
};
var InputSystem = GameObject.extend("InputSystem");
InputSystem.prototype._init = function() {
	GameObject.prototype._init.call(this);
	this.hasInput = false;
	this.lastInput = null;
};
InputSystem.prototype.update = function(parent, delta) {
	//this.hasInput = false;
	this.hasKey = Math.max(--this.hasKey,0);
};
InputSystem.prototype.click = function(x,y){
	this.hasInput = true;
	this.lastInput = {x: x, y: y};
}
InputSystem.prototype.mouseDown = function(x,y){
	this.hasInput = true;
	this.lastInput = {x: x, y: y};
}
InputSystem.prototype.keyDown = function(keyCode){
	this.hasKey = 2;
	this.keyCode = keyCode;
}
var MoveToClickComponent = GameComponent.extend("MoveToClickComponent");
MoveToClickComponent.prototype.update = function(parent, delta) {
	if(sInputSystem.hasInput){
		parent.position.set(sInputSystem.lastInput);
		sInputSystem.hasInput = false;
	}
};
var AirResistanceComponent = GameComponent.extend("AirResistanceComponent");
AirResistanceComponent.prototype._init = function(csa,rho) {
	this.csa = csa;
	this.rho = typeof rho == "number" ? rho : 0.001;
};
AirResistanceComponent.prototype.update = function(parent,delta) {
	var mag2 = parent.velocity.magnitude2(),
		scalar = 1-mag2*this.rho*this.csa*delta;
	parent.velocity.scale(scalar);
	return;
	var	dvx = Math.abs(Math.sin(theta)*dv),
		dvy = Math.abs(Math.cos(theta)*dv);
		// Math.abs... Math.min....
	if(dvx > Math.abs(parent.vx))
		parent.vx = 0;
	else
		parent.vx = parent.vx + (parent.vx < 0 ? dvx : -dvx);
	if(dvy > Math.abs(parent.vy))
		parent.vy = 0;
	else
		parent.vy = parent.vy + (parent.vy < 0 ? dvy : -dvy);
};
var DebugDrawDataComponentCount = 0,
	DebugDrawDataComponent = GameComponent.extend("DebugDrawDataComponent");
DebugDrawDataComponent.prototype._init = function(context, desc) {
	this.context = context;
	this.desc = desc;
	this.xOffset = DebugDrawDataComponentCount * 70 + 10;
	DebugDrawDataComponentCount++;
	this.maxX = this.maxY = this.maxVx = this.maxVy = this.maxV = 0;
};
DebugDrawDataComponent.prototype.update = function(parent, delta) {
	if(DEBUG){
		this.maxX = Math.max(this.maxX, parent.position.x);
		this.maxY = Math.max(this.maxY, parent.position.y);
		this.maxVx = Math.max(this.maxVx, parent.velocity.x);
		this.maxVy = Math.max(this.maxVy, parent.velocity.y);
		this.maxV = Math.max(this.maxV,parent.velocity.magnitude());
		this.context.fillStyle = "#999";
		var y = 0;
		if(typeof this.desc == "string")
			this.context.fillText(this.desc, this.xOffset, y+=15);
		this.context.fillText("x: " + parent.position.x.toFixed(), this.xOffset, y+=15);
		this.context.fillText("y: " + parent.position.y.toFixed(), this.xOffset, y+=15);
		this.context.fillText("vx: " + parent.velocity.x.toFixed(3), this.xOffset, y+=15);
		this.context.fillText("vy: " + parent.velocity.y.toFixed(3), this.xOffset, y+=15);
		this.context.fillText("v: " + parent.velocity.magnitude().toFixed(3), this.xOffset, y+=15);
		this.context.fillText("max x: " + this.maxX.toFixed(), this.xOffset, y+=15);
		this.context.fillText("max y: " + this.maxY.toFixed(), this.xOffset, y+=15);
		this.context.fillText("max vx: " + this.maxVx.toFixed(3), this.xOffset, y+=15);
		this.context.fillText("max vy: " + this.maxVy.toFixed(3), this.xOffset, y+=15);
		this.context.fillText("max v: " + this.maxV.toFixed(3), this.xOffset, y+=15);
	}
};
var BackgroundSystem = GameObject.extend("BackgroundSystem");
BackgroundSystem.prototype._init = function(coords) {
	GameObject.prototype._init.call(this);
	this.coords = coords;
};
BackgroundSystem.prototype.update = function(delta) {
	GameObject.prototype.update.call(this);
	var c = this.coords,
		i = 2,
		l = c.length;
	GameObject.sRenderSystem.strokePath(this.coords,"#000");

	if(DEBUG && false){
		this.context.strokeStyle = "#08f";
		this.context.beginPath();
		for(i=0;i<l-3;i+=2){
			var x1 = c[i],
				y1 = c[i+1],
				x2 = c[i+2],
				y2 = c[i+3],
				dx = x2 - x1,
				dy = y2 - y1,
				mx = x1 + dx * 0.5,
				my = y1 + dy * 0.5,
				nx = dy / Math.sqrt(dy * dy + dx * dx),
				ny = -dx / Math.sqrt(dy * dy + dx * dx);
			this.context.moveTo(mx,my);
			this.context.lineTo(mx+nx*30,my+ny*30);
		}
		this.context.stroke();
	}
};
var BackgroundCollisionComponent = GameComponent.extend("BackgroundCollisionComponent");
BackgroundCollisionComponent.prototype.update = function(parent, delta)
{
	var c = GameObject.sBackgroundSystem.coords,
		i = 0,
		l = c.length,
		t,u,n,w,
		f = 0.5,
		e = 0.9,
		p = new Vector2(),
		r = new Vector2(),
		q = new Vector2(),
		s = new Vector2(),
		q_p = new Vector2(),
		v = new Vector2();
	if(this.lastX){
		for(;i<l-3;i+=2)
		{
			// http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
			p.set(c[i  ],c[i+1]),
			r.set(c[i+2],c[i+3]).subtract(p),
			q.set(this.lastX, this.lastY);
			s.set(parent.position).subtract(q);
			q_p = q.clone().subtract(p);
			t = q_p.cross(s) / r.cross(s);
			u = q_p.cross(r) / r.cross(s);
			if(t >= 0 && t <= 1 && u >= 0 && u <= 1)
			{
				parent.position.x = this.lastX;
				parent.position.y = this.lastY;
				// http://stackoverflow.com/questions/573084/how-to-calculate-bounce-angle
				n = r.normal();
				v.set(parent.velocity);
				u = n.clone().scale(n.dot(v));
				w = v.clone().subtract(u);
				w.scale(f);
				u.scale(e);
				parent.velocity.set(w).subtract(u);
				break;
			}
		}
	}
	this.lastX = parent.position.x;
	this.lastY = parent.position.y;
}
var GravitateToClickComponent = GameComponent.extend("GravitateToClickComponent");
GravitateToClickComponent.prototype._init = function() {
	this.vector = new Vector2();
};
GravitateToClickComponent.prototype.update = function(parent, delta){
	if(sInputSystem.hasInput){
		var acc = this.vector;
		acc.set(sInputSystem.lastInput).set(parent.position);
		acc.normalise();
		acc.scale(0.001*delta);
		parent.velocity.add(acc);
	}
}
var DebugDrawGraphComponentCount = 0,
	DebugDrawGraphComponent = GameComponent.extend("DebugDrawGraphComponent"),
	DebugDrawGraphComponentMin,
	DebugDrawGraphComponentMax = 0;
DebugDrawGraphComponent.prototype._init = function(context, evaluate) {
	if(typeof evaluate != "function")
		evaluate = function(object){return object.x};
	this.context = context;
	this.evaluate = evaluate;
	this.values = [];
	this.valueIndex = 0;
	this.average = [];
	this.averageSize = 4;
	this.valueSize = height*this.averageSize;
	this.offsetX = 50 * DebugDrawGraphComponentCount;
	this.localMax = 0;
	this.localMaxAt = 0;
	DebugDrawGraphComponentCount++;
};
DebugDrawGraphComponent.prototype.update = function(parent, delta) {
	if(DEBUG){
		var skip = this.valueIndex % this.valueSize,
			v = this.evaluate(parent,delta),
			x,
			y = height,
			scale;
		if(typeof DebugDrawGraphComponentMin == "undefined")
			DebugDrawGraphComponentMin = v;
		if(index == this.localMaxAt)
			DebugDrawGraphComponentMax = v;
		DebugDrawGraphComponentMin = Math.min(DebugDrawGraphComponentMin, v);
		DebugDrawGraphComponentMax = Math.max(DebugDrawGraphComponentMax, v);
		scale = 50 / (DebugDrawGraphComponentMax - DebugDrawGraphComponentMin);
		x = this.offsetX + (v - DebugDrawGraphComponentMin) * scale;
		this.context.strokeStyle = "#F88";
		this.context.beginPath();
		this.context.moveTo(x, y);
		var limit = (this.valueIndex > this.valueSize) ? this.valueSize-1 : this.valueIndex-1;
		for(var i = limit;i>=0;i-=this.averageSize){
			var index = (this.valueIndex > this.valueSize) ?
					(i + skip + this.valueSize) % this.valueSize : i,
				avgSum = 0,
				avg,
				val;
			for(var j = 0; j < this.averageSize; j++){
				val = this.values[(index-j+this.valueSize)%this.valueSize];
				avgSum += val;
				if(val > this.localMax){
					this.localMax = val;
					this.localMaxAt = (index-j+this.valueSize)%this.valueSize;
				}
			}
			avg = avgSum / this.averageSize;
			x = this.offsetX + (avg - DebugDrawGraphComponentMin) * scale;
			y--;
			this.context.lineTo(x,y);
		}
		this.context.stroke();
		this.valueIndex++;
		this.values[skip] = v;
	}
};
DebugDrawGraphComponent.Velocity = function(object){return object.velocity.magnitude()};
DebugDrawGraphComponent.VelocityAngle = function(object){return object.velocity.angle()};
DebugDrawGraphComponent.Acceleration = function(){
	var lastV = new Vector2(),
		vector = new Vector2();
	return function(object, delta){
		vector.set(object.velocity).subtract(lastV).scale(1/delta);
		lastV.set(object.velocity);
		return vector.magnitude();
	}
}();
DebugDrawGraphComponent.AccelerationAngle = function(){
	var lastV = new Vector2(),
		vector = new Vector2();
	return function(object, delta){
		vector.set(object.velocity).subtract(lastV).scale(1/delta);
		lastV.set(object.velocity);
		return vector.angle();
	}
}();
var CameraSystem = GameObject.extend("CameraSystem");
CameraSystem.prototype._init = function(initX,initY,width,height) {
	GameObject.prototype._init.apply(this,arguments);
	this.width = width;
	this.height = height;
	this.watchObject = null;
	this.pruneList = [];
	this.suspendedObjects = [];
	this.rotation = 0;
	this.rotMat = Matrix.rotationMatrix(this.rotation);
	this.angle = 0;
	this.scaleMatrix = Matrix.scaleMatrix(1);
	this.shearMatrix = Matrix.shearMatrix(0);
	this.worldVec = new Vector2();
	this.screenVec = new Vector2();
	this.pruneVec = new Vector2();
};
CameraSystem.prototype.addManagerForPruning = function(objectManager) {
	if(objectManager instanceof GameObjectManager)
		this.pruneList.push(objectManager);
};
CameraSystem.prototype.worldToScreen = function(worldX,worldY){
	var v = this.worldVec.set(worldX, worldY);
	v.subtract(this.position);
	v.leftMultiply(this.shearMatrix);
	v.leftMultiply(this.scaleMatrix);
	v.leftMultiply(this.rotMat);
	v.add(width / 2, height / 2);
	return v;
};
CameraSystem.prototype.screenToWorld = function(screenX,screenY){
	var v = this.screenVec.set(screenX, screenY);
	v.subtract(width / 2, height / 2);
	v.leftMultiply(this.rotMat.inverse());
	v.leftMultiply(this.scaleMatrix.inverse());
	v.leftMultiply(this.shearMatrix.inverse());
	v.add(this.position);
	return v;
};
CameraSystem.prototype.update = function(delta) {
	GameObject.prototype.update.call(this, delta);
	//this.rotation += 0.0001 * delta;
	//this.rotMat = Matrix.rotationMatrix(-Vector2.angleBetween(suns[0],pointMasses[0]));
	//this.angle += 0.0001 * delta;
	//this.scaleMatrix.values[0][0] = -(Math.sin(this.angle)+0.5)*3;
	//this.scaleMatrix.values[1][1] = (Math.sin(this.angle)+0.5)*3;
	//this.rotMat = Matrix.rotationMatrix(this.rotation);
	var i = 0,
		l = this.pruneList.length,
		mgr, objs, j,
		dx, dy;
	for(; i < l; i++){
		mgr = this.pruneList[i];
		if(mgr instanceof GameObjectManager)
		{
			objs = mgr.objects;
			for(j=0;j<objs.length;j++){
				this.pruneVec.set(objs[j].position).subtract(this.position);
				if(Math.abs(this.pruneVec.x) > width * 2 || Math.abs(this.pruneVec.y) > height * 2)
				{
					mgr.removeObject(objs[j]);
					this.suspendedObjects.push({object: objs[j], parent: mgr, position: j});
				}
			}
		}
	}
};
var RenderSystem = GameObject.extend("RenderSystem");
(function(){
	RenderSystem.prototype._init = function(context) {
		GameObject.prototype._init.call(this);
		this.context = context;
	};
	function drawPath(context, path){
		var i = 2,
			l = path.length,
			v;
		context.beginPath();
		v = GameObject.sCameraSystem.worldToScreen(path[0],path[1]);
		context.moveTo(v.x,v.y);
		for(;i<l-1;i+=2){
			v = GameObject.sCameraSystem.worldToScreen(path[i],path[i+1]);
			context.lineTo(v.x,v.y);
		}
	}
	RenderSystem.prototype.strokePath = function(path, style) {
		if(typeof style == "undefined")
			style = '#000';
		this.context.strokeStyle = style;
		drawPath(this.context, path);
		this.context.stroke();
	};
	RenderSystem.prototype.fillPath = function(path, style) {
		if(typeof style == "undefined")
			style = '#000';
		this.context.fillStyle = style;
		drawPath(this.context, path);
		this.context.fill();
	};
	RenderSystem.prototype.fillCircle = function(x,y,r, style){
		var v = GameObject.sCameraSystem.worldToScreen(x,y);
		this.context.fillStyle = style;
		this.context.fillCircle(v.x, v.y, r);
	};
	RenderSystem.prototype.strokeRect = function(x,y,w,h, style){
		var v = GameObject.sCameraSystem.worldToScreen(x,y);
		this.context.strokeStyle = style;
		this.context.strokeRect(v.x, v.y, w, h);
	};
	RenderSystem.prototype.drawSprite = function(x,y,sprite) {
		// body...
	};
})();
var FollowComponent = GameComponent.extend("FollowComponent");
FollowComponent.prototype._init = function(object) {
	this.target = object;
};
FollowComponent.prototype.update = function(parent, delta) {
	parent.position.set(this.target.position);
};
var RotationComponent = GameComponent.extend("RotationComponent");
RotationComponent.prototype._init = function(dth) {
	this.rotationSpeed = dth;
};
RotationComponent.prototype.update = function(parent, delta) {
	parent.setRotation(parent.rotation + this.rotationSpeed * delta);
};
var DecayComponent = GameComponent.extend("DecayComponent");
DecayComponent.prototype._init = function(lifetime) {
	this.lifetime = lifetime;
	this.destroyOnTimeout = false;
	this.spawnOnTimeout = null;
};
DecayComponent.prototype.update = function(parent, delta) {
	this.lifetime -= delta;

	if(this.lifetime < 0){
		if(this.destroyOnTimeout)
			parent.life = 0;

		if(this.spawnOnTimeout != null){}
	}
};
