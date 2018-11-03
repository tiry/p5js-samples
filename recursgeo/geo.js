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

    if (patternSelector.value()==='Ellipse') {
        makeEllispe(trans.value());
    } else {
        eval("make" + patternSelector.value() + "(" + trans.value() +");");
    }

}

function makeEllispe(r) {

    rotate(angle.value());
    translate(trans.value(),0);
    fill(255*(r/trans.value()));
    ellipse(0,0,r);

    r=r*factor.value();
    if (r>4) {
        makeEllispe(r);
    }
}

function makeSquare(r) {

    rotate(angle.value());
    translate(trans.value(),0);
    fill(255*(r/trans.value()));
    rect(0,0,r,r)

    r=r*factor.value();
    if (r>4) {
        makeSquare(r);
    }

}

function makePath(l) {

    rotate(angle.value());
    line(0,0,0,-l);
    translate(0,-l);

    l=l*factor.value();
    if (l>4) {
        makePath(l);
    }
}


function makeBranch(l) {
    
    push();
    rotate(angle.value());
    line(0,0,0,-l);
    translate(0,-l);

    var l2=l*factor.value();
    if (l2>8) {
        makeBranch(l2);
    }
    pop();
    push();
    rotate(-angle.value());
    line(0,0,0,-l);
    translate(0,-l);

    l2=l*factor.value();
    if (l2>8) {
        makeBranch(l2);
    }
    pop();

}



function makeParabola(l) {    
    drawFunction(parabola);
}

function makeParabolas(l) {    
    drawFunction(parabola);

    var step = angle.value();
    if (Math.abs(step)<1) {
        // avoid crazy loops
        step = 1;
    }
    var steps = 360/angle.value();
    for (var i = 0;i < steps; i++) {
        rotate(step);
        drawFunction(parabola);
    }
}


function parabola(x) {
    x=x/5;
    return (x*x)/10;
}

function makeTrinome(l) {    
    drawFunction(trinome);
}

function makeTrinomes(l) {    
    drawFunction(trinome);

    var step = angle.value();
    if (Math.abs(step)<1) {
        // avoid crazy loops
        step = 1;
    }
    var steps = 360/angle.value();
    for (var i = 0;i < steps; i++) {
        rotate(step);
        drawFunction(function(x) {
            x=x/20;
            return (x*x*x +i*x*x + i*i*x)/10;        
        });
    }
}

function trinome(x) {
    x=x/20;
    return (x*x*x +2*x*x)/10;
}


function drawFunction(f) {

    var x=-bx/2;
    var y=f(x);
    var steps = bx/trans.value();

    for (var i=1; i <=steps; i=i+1) {
        var newX = x + trans.value();
        var newY = f(newX);
        line(x,-y,newX,-newY);
        x=newX;
        y=newY;
    }
}

var cangle=0;

function makeCycloidAnim(l) {

    var r = bx/2;
    fill(200,200,200);
    ellipse(0,0,r,r);

    push();

    cangle = cangle + angle.value()/2;

    rotate(cangle);    
    translate(r/2,0);

    fill(150,150,150);
    ellipse(0,0,r/2,r/2);


    rotate(cangle);    
    translate(r/4,0);
    fill(100,100,100);
    ellipse(0,0,r/8,r/8);


    pop();



}



function makeCycloid(l) {

    var a = 0;
    var ratio = 2*1/factor.value();
    var aratio = trans.value()/15;
    var step = angle.value()/2;
    if (step < 1) {
        step = 1;
    }
    while(a<360) {
        drawCycliodPos(a,ratio,aratio);
        a = a + step;    
    }

}


function drawCycliodPos(rot,ratio, aratio) {

    var r = bx/2;
    fill(200,200,200);
    //ellipse(0,0,r,r);

    push();
    
    rotate(rot);    
    translate(r/ratio,0);

    fill(150,150,150);
    //ellipse(0,0,r/ratio,r/ratio);

    rotate(rot*aratio);    
    translate(r/(ratio*2),0);
    fill(100,100,100);
    ellipse(0,0,r/(ratio*4),r/(ratio*4));

    pop();

}