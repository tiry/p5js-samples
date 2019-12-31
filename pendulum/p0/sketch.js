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

var tethaSizer;

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);
  tetha = PI/4;

  tethaSizer = createSlider(-PI/2, PI/2+0.05 , tetha, 0.05);
  tethaSizer.position(w-130, h+10);
  tethaSizer.style('width', '120px');
}

function draw() {
  background(220);
  translate(w/2,0);  
  // get new value from Slider
  tetha = tethaSizer.value();

  drawPendulum();
}

function drawPendulum(){

  stroke(color(0,0,0));  
  ellipse(0,0,5);
  
  var x = l*sin(tetha);
  var y = l*cos(tetha);
  
  line(0,0,x,y);
  
  ellipse(x,y,r);  

  drawLegend(x,y);
}

function drawLegend(x,y) {
  stroke(color(160,160,160));
  line(0,0,0,l);
  if (tetha>0) 
    arc(0,0,60,60,PI/2-tetha, PI/2);
  else
    arc(0,0,60,60,PI/2, PI/2-tetha);
}