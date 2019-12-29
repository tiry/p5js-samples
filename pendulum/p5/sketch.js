// canevas configuration
var h=400;
var w=600;
var fr=24; // framerate

// physics parameters
var friction = 0.002;
var g = 9.8;

var trace_length=100;

class Pendule {


  constructor(m, tetha, l, r, c) {
    this.m = m;
    this.tetha = tetha;
    this.l = l;
    this.r = r;
    this.c = c;    
    this.trace = [];
    
    this.av = 0;
  }

  updatePhysics() {
    
    // compute angular acceleration: 2nd Newton law
    var acc = -sin(this.tetha) * g / (this.l);

    // add to angular velocity    
    this.av += acc;

    // account for some friction
    this.av = this.av * (1-friction);

    // update the new angle
    this.tetha += this.av;

    // track moves
    if (this.trace.length > trace_length) {
      this.trace.shift();
    }
    this.trace.push(this.tetha);
    
  }

  draw() {
    ellipse(0, 0, 5);
    var x = this.l * sin(this.tetha);
    var y = this.l * cos(this.tetha);
    line(0, 0, x, y);
    fill(this.c);
    ellipse(x, y, this.r);            
  }

  drawTrack() {
    for (var i = 0; i < this.trace.length; i++) {
      fill(this.c);
      ellipse(-w / 2 + i * w / trace_length, 300 + 50 * this.trace[i], 5);
    }
  }

  
}



var p;

function setup() {
  createCanvas(w, h);
  frameRate(fr);
  p = new Pendule(5, PI / 3, 230, 20, color(0, 255, 0));
}

function draw() {
  background(220);
  translate(w/2,0);
  
  p.updatePhysics();
  p.draw();
  p.drawTrack();

}

