var bx= 800 ;
var by= 600;

var angle;
var trans;
var factor;
var yscroll;
var patternSelector;

function setup (){
    createCanvas(bx,by);
    frameRate(5);
    angleMode(DEGREES);

    angle = createSlider(-30, 30, 15, 0.1);
    angle.position(bx-170, 10);
    angle.style('width', '80px');

    trans = createSlider(2, 120, 25, 0.1);
    trans.position(bx-170, 40);
    trans.style('width', '80px');

    factor = createSlider(0.5, 0.99 , 0.8, 0.01);
    factor.position(bx-170, 70);
    factor.style('width', '80px');

    yscroll = createSlider(0, by , by/2, 5);
    yscroll.position(bx-170, 100);
    yscroll.style('width', '80px');
    
    patternSelector = createSelect();
    patternSelector.position(bx-170, 130);
    patternSelector.option('Ellipse');
    patternSelector.option('Square');
    patternSelector.option('Path');
    patternSelector.option('Branch');
    patternSelector.option('Parabola');
    patternSelector.option('Parabolas');
    patternSelector.option('Trinome');
    patternSelector.option('Trinomes');
    patternSelector.option('CycloidAnim');
    patternSelector.option('Cycloid');
}

function draw() {

    background(200, 200, 220);
    textSize(15);

    text("Angle: " + angle.value() + " d", angle.x  + angle.width, angle.y+10);
    text("Length: " + trans.value(), trans.x  + trans.width, trans.y+10);
    text("Growth:" + factor.value(), factor.x  + factor.width, factor.y+10);
    text("Y-Scroll:" + yscroll.value(), yscroll.x  + yscroll.width, yscroll.y+10);

    // center 
    translate(bx/2,yscroll.value());
    ellipse(0,0,10);


}
