// canevas configuration
var h=400;
var w=600;
var fr=24; // framerate

// pendulum size
var r=20;
var l=200;

// pendulum angle
// current angle
var tetha=0;
// angular velocity
var av=0;


// physics parameters
var friction = 0.002;
var g = 9.8;

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);
  tetha=PI/5;
}

function draw() {
  background(220);
  translate(w/2,0);  
  updatePosition();
  drawPendulum();
}

// uses Newton's second law
function updatePosition() {

  // approximate calculus ...
  var acc = -sin(tetha) * g / (l);

  // add to angular velocity    
  av += acc;

  // account for some friction
  av = av * (1-friction);
  
  // update the new angle
  tetha += av;
}

function drawPendulum(){
  
  ellipse(0,0,5);
  
  var x = l*sin(tetha);
  var y = l*cos(tetha);
  
  line(0,0,x,y);
  
  ellipse(x,y,r);  
}