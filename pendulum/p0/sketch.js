// canevas configuration
var h=400;
var w=600;
var fr=30; // framerate

// pendulum size
var r=20;
var l=200;

// pendulum angle
var tetha=0;
var angle=0;

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);
  tetha = PI/4;
}

function draw() {
  background(220);
  translate(w/2,0);  
  drawPendulum();
}

function drawPendulum(){
  
  ellipse(0,0,5);
  
  var x = l*sin(tetha);
  var y = l*cos(tetha);
  
  line(0,0,x,y);
  
  ellipse(x,y,r);  
}