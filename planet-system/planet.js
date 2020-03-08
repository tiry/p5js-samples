var TAIL_SIZE=50;

class Planet {

    constructor(size) {

      this.id = planets.length + 0;
      this.density=1;
      this.size=size;
      this.mass= this.density * Math.pow(this.size,3);
  
      this.color = color(200,50,50);
      this.pos = createVector(0,0);
      this.v = createVector();
      this.a = createVector();
  
      this.dead=false;
      this.tail=[];
    }
  
    computeMass() {
      this.mass= this.density * Math.pow(this.size,3);
    }
  
    isCollidingWith(other) {
      if (other.dead) {
        return false;
      }
      return this.pos.dist(other.pos) < (this.size+other.size);
    }
  
    isColliding(others) {
  
      for (var i = 0; i < others.length; i++) {
        if (this.isCollidingWith(others[i])) {
          return true;
        }
      }
      return false;
    }
  
    merge (other) {
      var tmass = other.mass + this.mass;

      var c = color(
          (this.color._getHue()*this.mass + other.color._getHue()*other.mass)/(this.mass+other.mass),
          (this.color._getSaturation()*this.mass + other.color._getSaturation()*other.mass)/(this.mass+other.mass),
          (this.color._getBrightness()*this.mass + other.color._getBrightness()*other.mass)/(this.mass+other.mass)
      );        

      if (other.size > this.size) {
        other.size = Math.cbrt(tmass/other.density);
        other.mass = tmass;
        other.v.mult(other.mass/tmass).add(this.v.mult(this.mass/tmass));
        this.dead = true;
        other.color=c;

      } else {
        this.size = Math.cbrt(tmass/this.density);
        this.mass = tmass;
        this.v.mult(this.mass/tmass).add(other.v.mult(other.mass/tmass));
        other.dead = true;
        this.color=c;
      }
    }
  
    computeAttractionVectorFor(other) {
      var r = this.pos.dist(other.pos);
      if (this.isCollidingWith(other)) {
        this.merge(other);
        return createVector();
      }
      var f = G * (this.mass * other.mass)/Math.pow(r,2);
      var attraction = p5.Vector.sub(other.pos, this.pos).normalize().mult(f);
      this.att = attraction;
      return attraction;
    }
  
    computeAttractionVector(others) {
      var v= createVector(0,0);
      for (var i = 0; i < others.length; i++) {
        if (others[i].id!=this.id) {
          var f = this.computeAttractionVectorFor(others[i]);
          v.add(f);
        }
      }
      return v;
    }
  
    computeMove(others) { 
      this.a = this.computeAttractionVector(others).mult(1/this.mass);    
    }
  
    move(dt) {
      this.v.add(this.a);
      let depl = p5.Vector.mult(this.v,dt/200);
      this.pos.add(depl);
  
      if (frameCount % 8==0) {
        this.tail.push(this.pos.copy());
        if (this.tail.length>TAIL_SIZE) {
          this.tail.shift();
        }  
        this._checkOutOfScreen();
      }      
    }

    _checkOutOfScreen() {

        if (this.pos.dist(planets[0].pos)>5*Math.max(w,h)) {
            console.log("Planet " + this.id + " is away");
            //console.log("Planets alive: " + planets.length);
            this.dead=true;
        }
    }
  
    draw() {
      strokeWeight(2);
      stroke(color(this.color._getHue(),this.color._getSaturation(),this.color._getBrightness()-25));
      fill(this.color);
  
      var brighnessStep = (this.color._getBrightness())/this.tail.length;
      // tail
      for (var i = 0; i < this.tail.length-1; i++) {
        stroke(color(this.color._getHue(),this.color._getSaturation(),this.color._getBrightness()-brighnessStep*(this.tail.length-i)));
        line(this.tail[i].x, this.tail[i].y, this.tail[i+1].x, this.tail[i+1].y);      
      }
  
      // planet 
      circle(this.pos.x, this.pos.y, this.size*2);
  
      // draw speed
      if (displaySpeed) {
        var speed = p5.Vector.mult(this.v, 2);
        speed.normalize();
        speed.mult(100);
        strokeWeight(4);
        stroke(color(100,200,100));
        line (this.pos.x, this.pos.y, this.pos.x+speed.x, this.pos.y+speed.y);
      }
    }
  
  }
  