var bx= 800 ;
var by= 600;

var angle;
var trans;
var factor;
var yscroll;


var a=130;
var b=200;
var h=230;


var xSizer;

var margin = 0;

var offset;

var nbSteps=100;    
var nbSections=5;


function setup (){
    createCanvas(bx,by);
    //normalMaterial();
    frameRate(20);
    angleMode(DEGREES);


    offset = createSlider(0, nbSections*nbSteps , 0, 1);
    offset.position(bx-500, 20);
    offset.style('width', '400px');

/*    xSizer = createSlider(2, 12 , g_width, 1);
    xSizer.position(bx+20, 70);
    xSizer.style('width', '80px');

    ySizer = createSlider(2, 12 , g_height, 1);
    ySizer.position(bx+20, 100);
    ySizer.style('width', '80px');

    zSizer = createSlider(2, 12 , g_depth, 1);
    zSizer.position(bx+20, 130);
    zSizer.style('width', '80px');

    animate = createRadio();
    animate.option('on', 1);
    animate.option('off', 0);
    animate.position(bx+20, 40);*/

}


function drawCubes(frameCount) {

      

}

function drawTriangle() {

}

function draw() {




    var fc = offset.value(); // frameCount

    var step=fc%(nbSteps);

    var section = Math.floor(fc/nbSteps)%nbSections;

    console.log(section);
    console.log(step);



    background(220, 220, 220);

    translate((bx-(a+b))/2, (by+h)/2 ) ;

    var c1=color(255,255,255);
    var c2=color(200,200,255);
    var c2a=color(220,220,255);
    var c3=color(200,255,200);
    var c3a=color(220,255,220);


    // main triangle
    fill(c1);
    triangle(0,0, a+b, 0, a, -h );

    if (section>=1) {
        // subparts
        fill(color(c2));
        triangle(0,0, a, 0, a, -h );
        fill(color(c3));
        triangle(a,0, a+b, 0, a, -h );
    }
    if (section==2) {

        translate(step/100*a,step/100*-h);
        //circle(0, 0, 20);
        rotate(180*step/100);
        fill(c2a);    
        triangle(0,0, a, 0, a, -h );

    }
    else if (section==3) {
        push()

        translate(a,-h);
        rotate(180);
        fill(c2a);    
        triangle(0,0, a, 0, a, -h );

        pop();
        push();

        //translate(step/100*(2*b),step/100*-h);
        translate((a+b)-b*step/100,step/100*-h);
        //circle(0, 0, 20);
        rotate(-180*step/100);
        fill(c3a);    
        triangle(a-(a+b),0, a+b-(a+b), 0, a-(a+b), -h );

        pop();

    }
    else if (section==4) {
        push()

        translate(a,-h);
        rotate(180);
        fill(c2a);    
        triangle(0,0, a, 0, a, -h );

        pop();
        push();

        translate(a,-h);
        rotate(-180);
        fill(c3a);    
        triangle(a-(a+b),0, a+b-(a+b), 0, a-(a+b), -h );

        pop();

    }
    




    //fill(color(200,200,255));
    //triangle(a,0, a+b, 0, a, -h );


}
