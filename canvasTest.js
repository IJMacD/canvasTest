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
window.onload = function(){
	// -----------------
	// Define Components
	// -----------------
	Vector = Object.extend();
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
		Vector2 = Vector.extend();
		Vector2.prototype._init = function(x,y){
			if(arguments.length == 0){
				x = 0;
				y = 0;
			}
			this.x = x;
			this.y = y;
			this.length = 2;
		};
		Vector2.prototype.toString = function(){
			return "["+this.x+","+this.y+"]";
		};
		Vector2.prototype.clone = function() {
			return new Vector2(this.x, this.y);
		};
		Vector2.prototype.set = function(x,y) {
			if(x instanceof Vector2){
				this.x = x.x;
				this.y = x.y;
			}
			else {
				this.x = x;
				this.y = y;
			}
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
			this.x /= mag;
			this.y /= mag;
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
		Vector3 = Vector.extend();
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
		Matrix = Object.extend();
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
	})();
	var GameObject = Object.extend("GameObject");
	GameObject.prototype._init = function(x, y){
		this.components = [];
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
		this.toBeRemoved = [];
	};
	GameObject.prototype.addComponent = function(component){
		if(component instanceof GameComponent)
			this.components.push(component);
		return this;
	};
	GameObject.prototype.removeComponent = function(component){
		this.toBeRemoved.push(component);
	}
	GameObject.prototype.removeComponentByName = function(name){
		for(var i = 0; i < this.components.length; i++){
			if(this.components[i].name == name)
				this.toBeRemoved.push(this.components[i]);
		}
	}
	GameObject.prototype.removeComponentByTest = function(test){
		for(var i = 0; i < this.components.length; i++){
			if(test(this.components[i]))
				this.toBeRemoved.push(this.components[i]);
		}
	}
	GameObject.prototype.setPosition = function(x,y) {
		this.x = x;
		this.y = y;
		return this;
	};
	GameObject.prototype.setVelocity = function(vx,vy) {
		this.vx = vx;
		this.vy = vy;
		return this;
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
		if(typeof this.x == "number")
			html += " (" + this.x.toFixed() + "," + this.y.toFixed() + ")";
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
	};
	GameObjectManager.prototype.addObjectAt = function(index, object){
		if(object instanceof GameObject)
			this.objects.splice(index,0,object);
	};
	GameObjectManager.prototype.removeObject = function(object){
		if(!object instanceof GameObject)
			return;
		this.objectsToBeRemoved.push(object);
	};
	GameObjectManager.prototype.update = function(delta){
		var i = 0,
			l = this.objects.length,
			m = this.objectsToBeRemoved.length,
			j = 0;
		for(;i<l;i++)
			this.objects[i].update(delta);

		for(;j<m;j++){
			i = 0;
			l = this.objects.length;
			for(;i<l;i++){
				if(this.objects[i] == this.objectsToBeRemoved[j]){
					this.objects.remove(i);
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
	MoveComponent.prototype.update = function(parent, delta) {
		if(parent.vx)
			parent.x += parent.vx * delta;
		if(parent.vy)
			parent.y += parent.vy * delta;
	};
	var DrawComponent = GameComponent.extend("DrawComponent");
	DrawComponent.prototype._init = function(size, colour){
		this.size = size;
		this.colour = colour;
	};
	DrawComponent.prototype.update = function(parent, delta) {
		sRenderSystem.fillCircle(parent.x,parent.y,this.size,this.colour);
		sRenderSystem.fillCircle(parent.x+this.size*0.33,parent.y-this.size*0.33,this.size*0.45,"rgba(255,255,255,0.7)");
	};
	var DebugDrawPathComponent = GameComponent.extend("DebugDrawPathComponent");
	DebugDrawPathComponent.prototype._init = function(){
		this.path = [];
		this.pathSize = 1000;
		this.pathIndex = 0;
		this.lastVx = 0;
		this.lastVy = 0;
	};
	DebugDrawPathComponent.prototype.update = function(parent, delta) {
		if(DEBUG){
			// Draw Path
			var skip = this.pathIndex % this.pathSize,
				path = [parent.x, parent.y];
			if(this.pathIndex > this.pathSize){
				for(var i = this.pathSize-1;i>=0;i--){
					var index = (i + skip + this.pathSize) % this.pathSize;
					path.push(this.path[index][0],this.path[index][1]);
				}
			}else{
				for(var i = this.pathIndex-1;i>=0;i--){
					path.push(this.path[i][0],this.path[i][1]);
				}
			}
			sRenderSystem.strokePath(path,"#CCC");
			this.pathIndex++;
			this.path[skip] = [parent.x,parent.y];

			// Draw Velocity
			sRenderSystem.strokePath([parent.x, parent.y,parent.x+parent.vx*100, parent.y+parent.vy*100],"rgba(0,128,255,0.7)");

			// Draw Acceleration
			var ax = (parent.vx - this.lastVx)/delta,
				ay = (parent.vy - this.lastVy)/delta;
			this.lastVx = parent.vx;
			this.lastVy = parent.vy;
			sRenderSystem.strokePath([parent.x, parent.y,parent.x+ax*4e5, parent.y+ay*4e5],"rgba(0,255,0,0.7)")
		}else{
			this.pathIndex = 0;
		}
	};
	var BounceComponent = GameComponent.extend("BounceComponent");
	BounceComponent.prototype._init = function(width, height, roomWidth, roomHeight) {
		this.ax = width / 2;
		this.ay = height / 2;
		this.bx = roomWidth - this.ax;
		this.by = roomHeight - this.ay;
	};
	BounceComponent.prototype.update = function(parent, delta) {
		var coef = 0.9;
		if(parent.x < this.ax){
			parent.x = this.ax;
			parent.vx = -parent.vx*coef;
		}
		if(parent.x > this.bx){
			parent.x = this.bx;
			parent.vx = -parent.vx*coef;
		}
		if(parent.y < this.ay){
			parent.y = this.ay;
			parent.vy = -parent.vy*coef;
		}
		if(parent.y > this.by){
			parent.y = this.by;
			parent.vy = -parent.vy*coef;
		}
	};
	var GravityComponent = GameComponent.extend("GravityComponent");
	GravityComponent.prototype.update = function(parent, delta) {
		if(typeof parent.vy == "undefined")
			parent.vy = 0;
		parent.vy += 0.0001*delta;
	};
	var RandomMoveComponent = GameComponent.extend("RandomMoveComponent");
	RandomMoveComponent.prototype.update = function(parent, delta) {
		if(Math.random()<0.001){
			parent.vx = Math.random()-0.5;
			parent.vy = Math.random()-0.5;
		}
	};
	var PointGravityComponent = GameComponent.extend("PointGravityComponent");
	PointGravityComponent.prototype._init = function(target) {
		this.target = target;
		this.vector = new Vector2();
	};
	PointGravityComponent.prototype.update = function(parent, delta) {
		var vec = this.vector.set(this.target.x, this.target.y).subtract(parent.x, parent.y),
			theta = vec.angle(),
			scalar = this.target.mass*delta/vec.magnitude2();
		vec.set(Math.sin(theta),Math.cos(theta));
		vec.scale(scalar);
		parent.vx += vec.x;
		parent.vy += vec.y;
	};
	PointGravityComponent.referencesTest = function(object){
		return function(testComponent){
			return testComponent instanceof PointGravityComponent &&
				testComponent.target == object;
		};
	};
	var CollisionComponent = GameComponent.extend("CollisionComponent");
	CollisionComponent.prototype._init = function(width, height) {
		this.halfWidth = width / 2;
		this.halfHeight = height / 2;
	};
	CollisionComponent.prototype.update = function(parent, delta) {
		var bounds = sCollisionSystem.getBounds(),
			i = 0,
			l = bounds.length,
			collision = false;
		for(; i < l; i++){
			collision = (
					parent.x + this.halfWidth > bounds[i][0] &&
					parent.x - this.halfWidth  < bounds[i][2] &&
					parent.y + this.halfHeight > bounds[i][1] &&
					parent.y - this.halfHeight < bounds[i][3]
				) ? bounds[i][4] : false;
			if(collision)
				break;
		}

		if(collision){
			switch(collision.name){
				case "MassiveObject":
					ballManager.removeObject(parent);
					break;
				case "RedBall":
					if(collision != parent){
						parent.vx = -parent.vx*0.9;
						parent.vy = -parent.vy*0.9;
					}
					break;
			}
		}
	};
	var CollisionSystem = GameObject.extend("CollisionSystem");
	CollisionSystem.prototype._init = function() {
		GameObject.prototype._init.call(this);
		this.bounds = [[],[]];
		this.boundsCount = 2;
		this.readIndex = 1;
		this.writeIndex = 0;
	};
	CollisionSystem.prototype.update = function(delta) {
		GameObject.prototype.update.call(this,delta);
		this.readIndex = (this.readIndex + 1) % this.boundsCount;
		this.writeIndex = (this.writeIndex + 1) % this.boundsCount;
		//this.boundsIndex = (this.boundsIndex + 1) % this.boundsCount;
		this.bounds[this.writeIndex] = [];
	};
	CollisionSystem.prototype.addCollisionBounds = function(x,y,w,h,object){
		this.getNextBounds().push([x-w/2,y-h/2,x+w/2,y+h/2,object]);
	};
	CollisionSystem.prototype.getBounds = function(){
		return this.bounds[this.readIndex];
	}
	CollisionSystem.prototype.getNextBounds = function(){
		return this.bounds[this.writeIndex];
	}
	var SolidComponent = GameComponent.extend("SolidComponent");
	SolidComponent.prototype._init = function(width, height) {
		this.width = width;
		this.height = height;
	};
	SolidComponent.prototype.update = function(parent, delta) {
		sCollisionSystem.addCollisionBounds(parent.x, parent.y, this.width, this.height, parent);
	};
	var DebugDrawBoundsComponent = GameComponent.extend("DebugDrawBoundsComponent");
	DebugDrawBoundsComponent.prototype._init = function(context){
		this.context = context;
	}
	DebugDrawBoundsComponent.prototype.update = function(parent, delta) {
		if(DEBUG){
			var bounds = sCollisionSystem.getBounds();
			for(var i=0;i<bounds.length;i++){
				var bound = bounds[i];
				sRenderSystem.strokeRect(bound[0],bound[1],bound[2]-bound[0],bound[3]-bound[1],"#999");
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
	};
	InputSystem.prototype.click = function(x,y){
		this.hasInput = true;
		this.lastInput = {x: x, y: y};
	}
	InputSystem.prototype.mouseDown = function(x,y){
		this.hasInput = true;
		this.lastInput = {x: x, y: y};
	}
	var MoveToClickComponent = GameComponent.extend("MoveToClickComponent");
	MoveToClickComponent.prototype.update = function(parent, delta) {
		if(sInputSystem.hasInput){
			parent.x = sInputSystem.lastInput.x;
			parent.y = sInputSystem.lastInput.y;
			sInputSystem.hasInput = false;
		}
	};
	var AirResistanceComponent = GameComponent.extend("AirResistanceComponent");
	AirResistanceComponent.prototype._init = function(csa,rho) {
		this.csa = csa;
		this.rho = typeof rho == "number" ? rho : 0.001;
	};
	AirResistanceComponent.prototype.update = function(parent,delta) {
		var mag2 = parent.vx*parent.vx + parent.vy*parent.vy,
			theta = Math.atan2(parent.vx, parent.vy),
			dv = mag2*this.rho*this.csa*delta,
			dvx = Math.abs(Math.sin(theta)*dv),
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
			this.maxX = Math.max(this.maxX, parent.x);
			this.maxY = Math.max(this.maxY, parent.y);
			this.maxVx = Math.max(this.maxVx, parent.vx);
			this.maxVy = Math.max(this.maxVy, parent.vy);
			this.maxV = Math.max(this.maxV,Math.sqrt(parent.vx*parent.vx + parent.vy*parent.vy));
			this.context.fillStyle = "#999";
			var y = 0;
			if(typeof this.desc == "string")
				this.context.fillText(this.desc, this.xOffset, y+=15);
			this.context.fillText("x: " + parent.x.toFixed(), this.xOffset, y+=15);
			this.context.fillText("y: " + parent.y.toFixed(), this.xOffset, y+=15);
			this.context.fillText("vx: " + parent.vx.toFixed(3), this.xOffset, y+=15);
			this.context.fillText("vy: " + parent.vy.toFixed(3), this.xOffset, y+=15);
			this.context.fillText("v: " + Math.sqrt(parent.vx*parent.vx + parent.vy*parent.vy).toFixed(3), this.xOffset, y+=15);
			this.context.fillText("max x: " + this.maxX.toFixed(), this.xOffset, y+=15);
			this.context.fillText("max y: " + this.maxY.toFixed(), this.xOffset, y+=15);
			this.context.fillText("max vx: " + this.maxVx.toFixed(3), this.xOffset, y+=15);
			this.context.fillText("max vy: " + this.maxVy.toFixed(3), this.xOffset, y+=15);
			this.context.fillText("max v: " + this.maxV.toFixed(3), this.xOffset, y+=15);
		}
	};
	var BackgroundSystem = GameObject.extend("BackgroundSystem");
	BackgroundSystem.prototype._init = function(coords) {
		this.coords = coords;
	};
	BackgroundSystem.prototype.update = function(delta) {
		GameObject.prototype._init.call(this);
		var c = this.coords,
			i = 2,
			l = c.length;
		sRenderSystem.strokePath(this.coords,"#000");

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
		var c = sBackgroundSystem.coords,
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
				s.set(parent.x, parent.y).subtract(q);
				q_p = q.clone().subtract(p);
				t = q_p.cross(s) / r.cross(s);
				u = q_p.cross(r) / r.cross(s);
				if(t >= 0 && t <= 1 && u >= 0 && u <= 1)
				{
					parent.x = this.lastX;
					parent.y = this.lastY;
					// http://stackoverflow.com/questions/573084/how-to-calculate-bounce-angle
					n = r.normal();
					v.set(parent.vx, parent.vy);
					u = n.clone().scale(n.dot(v));
					w = v.clone().subtract(u);
					w.scale(f);
					u.scale(e);
					parent.vx = w.x - u.x;
					parent.vy = w.y - u.y;
					break;
				}
			}
		}
		this.lastX = parent.x;
		this.lastY = parent.y;
	}
	var GravitateToClickComponent = GameComponent.extend("GravitateToClickComponent");
	GravitateToClickComponent.prototype.update = function(parent, delta){
		if(sInputSystem.hasInput){
			var dx = sInputSystem.lastInput.x - parent.x,
				dy = sInputSystem.lastInput.y - parent.y,
				theta = Math.atan2(dx, dy);
			parent.vx += Math.sin(theta)*0.001*delta;
			parent.vy += Math.cos(theta)*0.001*delta;
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
	DebugDrawGraphComponent.Velocity = function(object){return Math.sqrt(object.vx * object.vx + object.vy * object.vy)};
	DebugDrawGraphComponent.VelocityAngle = function(object){return Math.atan2(object.vx, object.vy)};
	DebugDrawGraphComponent.Acceleration = function(){
		var lastVx = 0, lastVy = 0;
		return function(object, delta){
			var dvx = (object.vx - lastVx) / delta,
				dvy = (object.vy - lastVy) / delta;
			lastVx = lastVx;
			lastVy = lastVy;
			return Math.sqrt(dvx * dvx + dvy * dvy);
		}
	}();
	DebugDrawGraphComponent.AccelerationAngle = function(){
		var lastVx = 0, lastVy = 0;
		return function(object, delta){
			var dvx = (object.vx - lastVx) / delta,
				dvy = (object.vy - lastVy) / delta;
			lastVx = lastVx;
			lastVy = lastVy;
			return Math.atan2(dvx, dvy);
		}
	}();
	var CameraSystem = GameObject.extend("CameraSystem");
	CameraSystem.prototype._init = function(initX,initY,width,height) {
		this.lookAt = new Vector2(initX,initY);
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
	};
	CameraSystem.prototype.watch = function(object) {
		if(typeof object.x == "number" &&
			typeof object.y == "number")
			this.watchObject = object;
	};
	CameraSystem.prototype.addManagerForPruning = function(objectManager) {
		if(objectManager instanceof GameObjectManager)
			this.pruneList.push(objectManager);
	};
	CameraSystem.prototype.worldToScreen = function(worldX,worldY){
		var v = this.worldVec.set(worldX, worldY);
		v.subtract(this.lookAt);
		v.leftMultiply(this.shearMatrix);
		v.leftMultiply(this.scaleMatrix);
		v.leftMultiply(this.rotMat);
		v.add(width / 2, height / 2)
		return v;
	};
	CameraSystem.prototype.screenToWorld = function(screenX,screenY){
		var v = this.screenVec.set(screenX, screenY);
		v.subtract(width / 2, height / 2);
		v.leftMultiply(this.rotMat.inverse());
		v.leftMultiply(this.scaleMatrix.inverse());
		v.leftMultiply(this.shearMatrix.inverse());
		v.add(this.lookAt);
		return v;
	};
	CameraSystem.prototype.update = function(delta) {
		if(this.watchObject)
			this.lookAt.set(this.watchObject.x, this.watchObject.y);
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
					dx = Math.abs(objs[j].x - this.lookAt.x);
					dy = Math.abs(objs[j].y - this.lookAt.y);
					if(dx > width * 2 || dy > height * 2)
					{
						mgr.removeObject(objs[j]);
						this.suspendedObjects.push({object: objs[j], parent: mgr, position: j});
					}
				}
			}
		}
	};
	var RenderSystem = GameObject.extend("RenderSystem");
	RenderSystem.prototype._init = function(context) {
		GameObject.prototype._init.call(this);
		this.context = context;
	};
	RenderSystem.prototype.strokePath = function(path, style) {
		var canvasX = width / 2 - sCameraSystem.lookAtX,
			canvasY = height / 2 - sCameraSystem.lookAtY,
			i = 2,
			l = path.length,
			v;
		this.context.strokeStyle = style;
		this.context.beginPath();
		v = sCameraSystem.worldToScreen(path[0],path[1]);
		this.context.moveTo(v.x,v.y);
		for(;i<l-1;i+=2){
			v = sCameraSystem.worldToScreen(path[i],path[i+1]);
			this.context.lineTo(v.x,v.y);
		}
		this.context.stroke();
	};
	RenderSystem.prototype.fillCircle = function(x,y,r, style){
		var v = sCameraSystem.worldToScreen(x,y);
		this.context.fillStyle = style;
		this.context.fillCircle(v.x, v.y, r);
	};
	RenderSystem.prototype.strokeRect = function(x,y,w,h, style){
		var v = sCameraSystem.worldToScreen(x,y);
		this.context.strokeStyle = style;
		this.context.strokeRect(v.x, v.y, w, h);
	};
	RenderSystem.prototype.drawSprite = function(x,y,sprite) {
		// body...
	};


	// -----------------
	// Create Game Graph
	// -----------------
	var ctx = document.getElementsByTagName('canvas')[0].getContext('2d'),
		gameRoot = new GameObjectManager(),
		sunManager = new GameObjectManager(),
		ballManager = new GameObjectManager(),
		pointMassManager = new GameObjectManager(),
		width = ctx.canvas.width,
		height = ctx.canvas.height,
		ballSize = 4,
	    random = function(sd, mean){
	        var d=10, r=0, i=0;
	        for(;i<d;i++)
	            r += Math.random();
	        r = r / d * 2 - 1;
	        if(typeof sd != "undefined" &&
	            typeof mean != "undefined")
	            r = sd * r + mean;
	        return r;
	    },
	    DEBUG = true,
	    sCollisionSystem = new CollisionSystem(),
	    sBackgroundSystem = new BackgroundSystem([58,562,90,570,121,568,152,567,185,573,202,566,218,568,239,569,260,569,275,566,293,561,302,560,316,560,336,560,352,560,368,560,387,563,405,562,421,561,434,561,453,562,473,563,496,564,517,559,533,556,547,556,571,554,601,555,612,557,621,560,646,558,667,554,683,552,702,549,712,549,724,555,737,561,746,562,765,562,783,558,791,558,799,555,812,550,815,548,832,545,846,544,854,543,859,543,868,541,880,537,894,536,900,536,916,524,916,524,917,523,920,515,925,509,925,500,926,498,932,483,934,466,937,461,947,442,947,433,945,427,941,418,946,404,949,404,964,397,966,394,966,371,966,366,959,361,950,361,948,361,938,360,935,356,934,344,936,324,937,309,938,297,939,294,935,281,938,269,943,251,940,235,940,221,947,207,952,193,955,182,951,171,957,163,962,154,962,139,958,127,949,125,947,125,928,127,923,122,912,120,899,115,888,113,874,109,862,107,855,96,844,90,829,84,814,79,791,72,773,66,764,50,755,39,751,32,751,22,738,16,712,19,710,28,709,50,709,70,701,71,695,57,689,48,682,36,675,31,666,26,659,24,657,36,652,55,650,64,645,82,642,93,637,88,629,80,621,66,619,56,618,44,609,36,604,27,590,27,577,27,575,34,574,46,570,50,565,57,560,69,554,70,550,80,545,87,539,89,533,87,523,73,521,69,509,62,502,53,491,49,490,36,484,33,478,31,462,25,455,28,441,39,440,51,438,64,439,83,442,104,440,120,432,127,426,119,426,105,425,88,419,68,407,59,405,52,400,48,388,38,378,34,366,41,354,56,342,59,333,59,324,53,316,53,304,52,298,50,290,48,286,57,273,64,270,72,270,86,275,92,281,106,277,112,289,120,290,137,290,153,283,165,274,171,259,170,246,169,236,183,237,197,238,212,238,224,238,237,233,244,221,247,216,247,203,241,201,236,200,231,188,230,171,223,164,220,168,209,171,206,178,201,180,199,185,193,178,181,160,177,150,179,128,189,107,195,87,193,70,183,54,182,28,185,22,196,22,211,31,228,36,234,37,254,30,270,40,281,57,291,66,291,81,286,94,287,98,287,106,283,125,276,145,277,148,283,187,289,217,283,236,283,259,286,266,285,283,285,302,285,324,280,347,265,356,254,362,237,383,227,406,208,427,206,453,204,504,199,515,199,541,188,567,186,598,180,628,170,663,161,689,160,707,160,741,157,753,161,785,171,785,179,785,190,792,221,795,234,777,245,767,248,755,245,749,237,739,231,734,225,717,222,705,222,690,222,687,222,679,234,669,241,667,253,663,258,661,270,656,273,651,272,643,260,636,255,632,254,624,248,616,239,605,237,591,229,575,228,566,229,555,236,542,242,535,251,523,258,518,265,498,239,488,243,470,250,446,245,442,255,427,261,417,269,411,278,398,289,393,294,388,305,388,306,387,317,389,332,393,340,399,349,405,367,406,377,409,385,417,395,431,398,444,398,453,398,458,412,470,427,492,431,545,414,569,399,585,385,608,371,613,357,661,332,681,321,711,321,737,326,758,327,771,335,775,343,776,354,778,371,774,384,768,398,773,408,757,435,737,439,725,455,714,469,698,454,680,451,666,467,645,481,624,476,621,473,612,467,601,463,593,463,580,463,566,466,556,473,542,483,522,490,503,488,488,484,479,480,464,471,444,464,427,452,416,447,401,434,381,428,364,428,346,424,331,420,317,417,300,416,294,418,289,419,276,422,263,423,252,420,238,414,234,411,227,408,215,407,209,406,200,401,198,386,195,377,189,369,170,365,160,362,148,354,127,342,127,342,102,340,88,337,69,340,54,343,50,351,42,363,41,369,41,379,42,390,40,406,40,413,42,421,48,433,48,443,48,457,48,460,47,495,35,503,35,507,35,515,36,525,36,526,43,536,43,547,44,551,53,554,58,562]),
	    //sBackgroundSystem = new BackgroundSystem([10,10,width - 10,10,width-10,height - 10,10,height-10,10,10]),
	    sCameraSystem = new CameraSystem(width / 2, height / 2, width, height),
	    sRenderSystem = new RenderSystem(ctx);
	sCollisionSystem.addComponent(new DebugDrawBoundsComponent(ctx));
	sCameraSystem.addManagerForPruning(ballManager);
	gameRoot.addObject(new CanvasManager(ctx));
	gameRoot.addObject(sBackgroundSystem);
	gameRoot.addObject(sCameraSystem);
	gameRoot.addObject(sRenderSystem);
	gameRoot.addObject(sunManager);
	gameRoot.addObject(ballManager);
	gameRoot.addObject(pointMassManager);

	var MassiveObject = GameObject.extend("MassiveObject");
	MassiveObject.prototype._init = function(x,y) {
		GameObject.prototype._init.call(this,x,y);
		this.mass = random(0.5,1);
		//this.addComponent(new BackgroundCollisionComponent());
		this.addComponent(new DrawComponent(12, "#ff0"));
		this.addComponent(new MoveComponent());
	};

	var chance = function(chanceIn){
		return Math.random() < 1 / (typeof chanceIn == "number" ? chanceIn : 2);
	}
	var RedBall = GameObject.extend("RedBall");
	RedBall.prototype._init = function(x,y) {
		GameObject.prototype._init.call(this,x,y);
		this.mass = 0.1;
		this.addComponent(new MoveComponent());
		//this.addComponent(new BackgroundCollisionComponent());
		this.addComponent(new DrawComponent(ballSize, "#f00"));
		this.addComponent(new DebugDrawPathComponent());
	};

	var y = 300,x,
		sunX = x = 500,
		suns = [],
		redBalls = [],
		pointMasses = [];
	sunManager.addObject(addSun(sunX,y).setVelocity(0,0));
	//pointMassManager.addObject(addPointMass(x,y+200));
	sCameraSystem.watch(suns[0]);
	var b;
	x += 60;
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));
	b = addRedBall(x+=20, y).setVelocity(0,1/Math.sqrt(x-sunX));

	function addSun(x,y){
		if(typeof x != "number") x = random(width, width/2);
		if(typeof y != "number") y = random(height, height/2);
		var massiveObject = new MassiveObject(x,y);
		sunManager.addObject(massiveObject);
		for(var i = 0; i < redBalls.length; i++)
			redBalls[i].addComponent(new PointGravityComponent(massiveObject));
		for(var i = 0; i < suns.length; i++){
			massiveObject.addComponent(new PointGravityComponent(suns[i]));
			suns[i].addComponent(new PointGravityComponent(massiveObject));
		}
		for(var i = 0; i < pointMasses.length; i++)
			massiveObject.addComponent(new PointGravityComponent(pointMasses[i]));
		massiveObject.addComponent(new DebugDrawPathComponent(ctx));
		massiveObject.addComponent(new MoveComponent());
		massiveObject.addComponent(new SolidComponent(24,24));
		suns.push(massiveObject);
		return massiveObject;
	}
	function addRedBall(x,y){
		if(typeof x != "number") x = random(width, width/2);
		if(typeof y != "number") y = random(height, height/2);
		var redBall = new RedBall(x,y);
		redBall.vx = random(0.5, 0);
		redBall.vy = random(0.5, 0);
		for(var i = 0; i < suns.length; i++){
			redBall.addComponent(new PointGravityComponent(suns[i]));
		}
		for(var i = 0; i < pointMasses.length; i++){
			redBall.addComponent(new PointGravityComponent(pointMasses[i]));
		}
		redBall.addComponent(new CollisionComponent(8,8));
		redBall.addComponent(new DebugDrawDataComponent(ctx));
		ballManager.addObject(redBall);
		redBalls.push(redBall);
		return redBall;
	}
	function addPointMass(x,y){
	    var pointMass = new GameObject(x,y);
		pointMass.name = "PointMass";
		pointMass.mass = 1;
		for(var i = 0; i < redBalls.length; i++)
			redBalls[i].addComponent(new PointGravityComponent(pointMass));
		for(var j = 0; j < suns.length; j++)
			suns[j].addComponent(new PointGravityComponent(pointMass));
		//pointMass.addComponent(new MoveToClickComponent());
		pointMass.addComponent(new DrawComponent(2, "#000"));
		pointMassManager.addObject(pointMass);
		pointMasses.push(pointMass);
		return pointMass;
	}

	var canvas = document.getElementsByTagName('canvas')[0];
	// --------------------
	// Main Game Control
	// --------------------
	var lastTime;
	function loop(t){
		if(lastTime){
			var delta = Math.min(t - lastTime, 100);
			gameRoot.update(delta);
		}
		lastTime = t;
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);

	// -----
	// UI
	// -----
	var leftClickSelect = document.getElementById('left-click-slt'),
		rightClickSelect = document.getElementById('right-click-slt'),
		mode = null,
		mouseDown = false,
		currentObject;
	document.getElementsByTagName('button')[0].onclick = function(){
		canvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	};
	document.getElementsByTagName('button')[1].onclick = function(){
		addSun();
	};
	document.getElementsByTagName('button')[2].onclick = function(){
		for(var i = 0; i < 10; i++)
			addRedBall();
	};
	function enableDEBUG(){
		DEBUG = true;
		this.innerText = "Disable Debugging";
		this.onclick = disableDEBUG;
	}
	function disableDEBUG(){
		DEBUG = false;
		this.innerText = "Enable Debugging";
		this.onclick = enableDEBUG;
	}
	document.getElementsByTagName('button')[3].onclick = DEBUG ? disableDEBUG : enableDEBUG;
	document.getElementsByTagName('button')[3].innerText = DEBUG ? "Disable Debug Lines" : "Enable Debug Lines";
	canvas.onmousedown = function(event){
		mouseDown = {x: event.offsetX, y: event.offsetY};
		var worldDown = sCameraSystem.screenToWorld(mouseDown.x, mouseDown.y);
		mode = event.button == 0 ? leftClickSelect.value : rightClickSelect.value;
		switch(mode){
			case 'set-point-mass':
				if(pointMasses.length == 0)
					currentObject = addPointMass(worldDown.x, worldDown.y);
				else{
					currentObject = pointMasses[pointMasses.length-1];
					currentObject.setPosition(worldDown.x, worldDown.y);
				}
				break;
			case 'add-point-mass':
				currentObject = addPointMass(worldDown.x, worldDown.y);
				break;
			case 'add-ball':
				currentObject = addRedBall(worldDown.x, worldDown.y);
				currentObject.vx = 0;
				currentObject.vy = 0;
				currentObject.removeComponentByName("MoveComponent");
				currentObject.removeComponentByName("GravityComponent");
				currentObject.removeComponentByName("AirResistanceComponent");
				break;
			case 'add-sun':
				currentObject = addSun(worldDown.x, worldDown.y);
				currentObject.vx = 0;
				currentObject.vy = 0;
				currentObject.removeComponentByName("MoveComponent");
				break;
		}
	}
	canvas.onmousemove = function(event){
		if(mouseDown){
			var p = {x: event.offsetX, y: event.offsetY},
				worldPoint = sCameraSystem.screenToWorld(p.x, p.y);
			switch(mode){
				case 'add-ball':
				case 'add-sun':
					var dx = p.x - mouseDown.x,
						dy = p.y - mouseDown.y,
						worldDown = sCameraSystem.screenToWorld(mouseDown.x, mouseDown.y);
					currentObject.x = worldDown.x;
					currentObject.y = worldDown.y;
					currentObject.vx = dx / 100;
					currentObject.vy = dy / 100;
					break;
				case 'set-point-mass':
				case 'add-point-mass':
					currentObject.setPosition(worldPoint.x, worldPoint.y);
					break;
			}
		}
	}
	canvas.onmouseup = function(event){
		switch(mode){
			case 'add-ball':
				//currentObject.addComponent(new GravityComponent());
				currentObject.addComponent(new AirResistanceComponent(1,0.0001));
				currentObject.addComponent(new MoveComponent());
				break;
			case 'add-sun':
				currentObject.addComponent(new MoveComponent());
				break;
			case 'add-background':
				var p = sCameraSystem.screenToWorld(event.offsetX, event.offsetY);
				sBackgroundSystem.coords.push(p.x);
				sBackgroundSystem.coords.push(p.y);
				break;
			case 'remove-point-mass':
				var pointMass = pointMasses.pop();
				pointMassManager.removeObject(pointMass);
				for(var i = 0; i < sunManager.objects.length; i++){
					sunManager.objects[i].removeComponentByTest(PointGravityComponent.referencesTest(pointMass));
				}
				for(var i = 0; i < ballManager.objects.length; i++){
					ballManager.objects[i].removeComponentByTest(PointGravityComponent.referencesTest(pointMass));
				}
				break;
			case 'remove-sun':
				var sun = suns.pop();
				sunManager.removeObject(sun);
				for(var i = 0; i < sunManager.objects.length; i++){
					sunManager.objects[i].removeComponentByTest(PointGravityComponent.referencesTest(sun));
				}
				for(var i = 0; i < ballManager.objects.length; i++){
					ballManager.objects[i].removeComponentByTest(PointGravityComponent.referencesTest(sun));
				}
				break;
			case 'remove-ball':
				ballManager.removeObject(redBalls.pop());
				break;
			case 'remove-background':
				sBackgroundSystem.coords.pop();
				sBackgroundSystem.coords.pop();
				break;
		}
		mouseDown = false;
		mode = null;
		currentObject = null;
	}
	canvas.oncontextmenu = function(){return false;};
	var div = document.getElementById('game-tree'),
		updateTree = function(){div.innerHTML = gameRoot.toHTML();},
		interval = null;
	document.getElementsByTagName('button')[4].onclick = function(){
		updateTree();
	}
	document.getElementById('continuous-refresh-chk').onchange = function(e){
		if(e.target.checked)
			interval = setInterval(updateTree,100);
		else
			clearInterval(interval);
	}
	function updateBtnState(btn, input, updateRadios) {
        btn.toggleClass('active', input.prop('checked'));
        btn.toggleClass('disabled', input.prop('disabled'));
    }

    $(document).on('change', '.btn-toggle input', function(e) {
        var input = $(e.target);
        // radio button that are automatically unchecked dont trigger a change event
        if (input.is(':radio')) {
            var selector = 'input[type="radio"][name="' + input.attr('name') + '"]';
            $(selector).each(function() {
                var input = $(this),
                    btn = input.parents('.btn-toggle');
                updateBtnState(btn, input);
            });
        } else {
            var btn = input.parents('.btn-toggle');
            updateBtnState(btn, input);
        }
    });

    $('.btn-toggle').each(function() {
        var btn = $(this),
            input = btn.find('input');
        updateBtnState(btn, input);
    });
}