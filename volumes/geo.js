var bx= 1200 ;
var by= 700;

var angle;
var trans;
var factor;
var yscroll;
var offset;


var g_width=6;
var g_height=4;
var g_depth=2;
var color_scale=0.6;
var max_margin=1; // in ratio
var nb_steps=100;

var cube_size=50;

var animate;

var xSizer;

var margin = 0;

var font;

function preload() {
  font = loadFont(
    "https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf"
  );
}

function setup (){
    createCanvas(bx,by, WEBGL);
    //normalMaterial();
    frameRate(20);
    angleMode(DEGREES);
    
    xSizer = createSlider(2, 12 , g_width, 1);
    xSizer.position(bx+20, 70);
    xSizer.style('width', '80px');

    ySizer = createSlider(2, 12 , g_height, 1);
    ySizer.position(bx+20, 100);
    ySizer.style('width', '80px');

    zSizer = createSlider(2, 12 , g_depth, 1);
    zSizer.position(bx+20, 130);
    zSizer.style('width', '80px');

    offset = createSlider(0, 100 , 0, 1);
    offset.position(bx+20, 160);
    offset.style('width', '80px');

    animate = createRadio();
    animate.option('on', 1);
    animate.option('off', 0);
    animate.position(bx+20, 40);



    textFont(font, 30);
    textAlign(CENTER, CENTER);

    text('red',bx, 160);

}


function drawCubes(frameCount) {
  if (animate.value()==1) {
      margin=max_margin*(Math.sin(Math.PI * (frameCount%100)/100));
    }
  else {
    margin=max_margin*(Math.sin(Math.PI * offset.value()/200));
  }
  push();

  g_width = xSizer.value();
  g_height = ySizer.value();
  g_depth = zSizer.value();

  for (var x = 0; x < g_width; x++ ){
    for (var y = 0; y < g_height; y++){
        for (var z = 0; z < g_depth; z++){

          var space=(1+margin)*cube_size;            

          var c_r= 255*(1-color_scale*x/g_width);
          var c_g= 255*(1-color_scale*y/g_height);
          var c_b= 255*(1-color_scale*z/g_depth);
         
          var cube_idx=1 + x + y*g_width+ (g_depth-z-1)*g_width*g_height;

          pop();
          push(); 
          translate(-g_width*space/2,-g_height*space/2,-g_depth*space/2);
          translate(x*space, y*space,z*space);
          fill(color(c_r,c_g,c_b))
          box(cube_size);
          fill(color(0,0,0))
          translate(0,0,cube_size/2+2);
          text(cube_idx,0,0);

     }
  }
}
}

function draw() {

    background(240, 240, 240);

    orbitControl(5,5);

    drawCubes(frameCount);
}
