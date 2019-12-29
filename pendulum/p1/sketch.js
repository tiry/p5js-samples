// canevas configuration
var h=400;
var w=600;
var fr=30; // framerate

// pendulum size
var r=20;
var l=200;

// pendulum angle
// current angle
var tetha=0;
// start angle
var angle=0;
// angular change / speed
var delta=0;
var F = 60;

function setup() {
  createCanvas(w, h);
  frameRate(fr);
  angle=PI/5;
  tetha = angle;
  delta = - 2*angle/F;
}

function draw() {
  background(220);
  translate(w/2,0);  
  updatePosition();
  drawPendulum();
}

// simple animation: back & forth between -angle and +angle
function updatePosition() {
  tetha += delta;
  if ((tetha > angle) || (tetha < -angle)) {
    delta = -delta;
  }  
}

function drawPendulum(){
  
  ellipse(0,0,5);
  
  var x = l*sin(tetha);
  var y = l*cos(tetha);
  
  line(0,0,x,y);
  
  ellipse(x,y,r);  
}