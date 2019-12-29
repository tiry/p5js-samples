// canevas configuration
var h=400;
var w=600;
var fr=24; // framerate

// physics parameters
var friction = 0.002;
var g = 9.8;

class Pendule {


  constructor(m, tetha, l, r, c) {
    this.m = m;
    this.tetha = tetha;
    this.l = l;
    this.r = r;
    this.c = c;    
    
    this.av = 0;
    this.paused=false;
    this.x=0;
    this.y=0;    
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

    

  }

  draw() {
    ellipse(0, 0, 5);
    var x = this.l * sin(this.tetha);
    var y = this.l * cos(this.tetha);
    line(0, 0, x, y);
    fill(this.c);
    ellipse(x, y, this.r);            

    this.drawSpeed(x,y);
    this.drawWeight(x,y);

    this.x=x;
    this.y=y;

  }

  drawSpeed(x,y) {
    var vx=x+250*sin(PI/2-this.tetha)*this.av;
    var vy=y-250*cos(PI/2-this.tetha)*this.av;    
    line(x, y, vx, vy);    
    fill(color(255,0,0));
    ellipse(vx, vy, 4);    
  }

  drawWeight(x,y) {
    var p = this.m*g;
    line(x, y, x, y+p);    
    fill(color(0,0,255));
    ellipse(x, y+p, 4);    
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

}


function mouseClicked() {  
  var d = Math.sqrt(((mouseX-w/2)-p.x)**2 + (mouseY-p.y)**2);    
  if (d <= 2*p.r) {
    // pause?
    p.paused = !p.paused;
  }
  return false;
}

function mouseDragged(event) {
  if (p.paused) {
    // reset speed
    p.ov=0;
    // update angle
    var tx = mouseX-w/2;
    p.tetha=Math.asin(tx/p.l);
  }
}
