//Canvas x&y
var bx= 400 ;
var by= 600;

var level=1;
var gameover=false;

//Paddle
var Paddle = {
    x : bx/2,
    y : 525,
    rx : 33,
    ry:20,
};

//Ball
var ball = {
  x : 185,
  y : 285,
  vx : 0,
  vy : 3,
  r : 12
};

//Bricks
var bricks=[];

// **************************

function makeBrick(i) {

    var bwidth=60;
    var margin = 10;

    var nxsteps=Math.floor((bx-2*margin)/(bwidth/2));
    var line = Math.floor((3*i)/nxsteps);
    
    return {
        x : margin + ((3*i)%nxsteps) * (bwidth/2) + (line%2)*(bwidth/2),
        y : 25 + line*35,
        w : bwidth,
        h : 25,
        c : color(0,50+i*10,0),
        deleted : false
    }
}

function setup (){
    createCanvas(bx,by);
    frameRate(60);
    colorMode(RGB, 255);

    buildLevel();

    // initial position
    initPositions();
}

var levels = [
    [{n:2, c:'rgb(255,0,0)'}, {n:4, c:'rgb(0,255,0)'}, {n:5, c:'rgb(0,255,255)'}],
    [{n:5, c:'rgb(255,255,0)'}, {n:2, c:'rgb(0,255,255)'}, {n:4, c:'rgb(0,0,255)'}]
];

function buildLevel() {
    bricks = [];
    if (level==1) {
        // generate the bricks
        for (var i = 0; i <16; i=i+1) {
            bricks.push(makeBrick(i));
        }
    } 
    else {
        // use levels definition
        var ldef = levels[level-2];
        var bwidth=60;
        var margin = 10;
        for (var l = 0; l < ldef.length; l++) {
            var startx=(bx - ldef[l].n*bwidth - (ldef[l].n-1)*margin)/2;
            for (var i=0; i < ldef[l].n; i++) {
                bricks.push ({
                    x : startx + i*(margin+bwidth),
                    y : 25 + l*35,
                    w : bwidth,
                    h : 25,
                    c : ldef[l].c,
                    deleted : false
                });
            }
        }
    }
}

function initPositions() {
    Paddle.x = bx/2 - 3*Paddle.rx/2;
    ball.x = bx/2;
    ball.y = 285,
    ball.vx = 0;
    ball.vy = 3; 
}

function drawBall(ball){
    stroke(255,128,128)
    fill(200, 64, 64);
    ellipse(ball.x, ball.y, 2*ball.r);
}

function drawPaddle(Paddle){
    stroke(0,0,200)
    fill(0,0, 160);
    rect(Paddle.x, Paddle.y, Paddle.rx, Paddle.ry);
    fill(0,0, 128);
    rect(Paddle.x+Paddle.rx, Paddle.y, Paddle.rx, Paddle.ry);
    fill(0,0, 160);
    rect(Paddle.x+2*Paddle.rx, Paddle.y, Paddle.rx, Paddle.ry);
}

function drawBrick(b){
    if (b.deleted) {
        return;
    }
    //Brick 
    fill(b.c);
    rect(b.x,b.y,b.w,b.h);
}

function drawBricks(){
    for (var i=0; i < bricks.length; i++) {
        drawBrick(bricks[i]);
    }
}

function checkBrick(brick) {

    if (brick.deleted) {
        return;
    }
    bcx = brick.x + brick.w/2;
    bcy = brick.y + brick.h/2;

    // rebound on horizontal
    if ((ball.x > brick.x-ball.r/1.2) &&  (ball.x < brick.x+brick.w+ball.r/1.2)){    
        if (Math.abs(bcy-ball.y)<=(ball.r+brick.h/2)) {
                ball.vy=-ball.vy;    
                brick.deleted=true;
                return;
            }
    }

    // rebound on vertical
    if ((ball.y> brick.y-ball.r/1.2) && (ball.y < brick.y + brick.h+ball.r/1.2)) {
        if (Math.abs(bcx-ball.x)<=(ball.r/2+brick.w/2)) {
            ball.vx=-ball.vx;    
            brick.deleted=true;
        }
    }
}

function checkBricks() {
    var completed=true;
    for (var i=0; i < bricks.length; i++) {
        checkBrick(bricks[i]);
        if (!bricks[i].deleted) {
            completed=false;
        }
    }
    if (completed) {
        level = level+1;
        initPositions();
        buildLevel();
    }
}

function moveBallAndCheckBorders(ball) {

    // Ball X Movements
   ball.x= ball.x+ball.vx;
   // collision right
   if (ball.x>bx-ball.r) {
       ball.vx=-ball.vx;
   }
   // collision left
   if (ball.x<0+ball.r){
       ball.vx=-ball.vx
   }

   // Ball y Movments
   // collision up
   ball.y= ball.y+ball.vy;
   if (ball.y<0+ball.r){
       ball.vy=-ball.vy;
   }
   //collision bottom
   if (ball.y>by){
    gameover=true; 
   }
}

function handleBallPaddleCollisions(ball,Paddle) {
    if (ball.y > Paddle.y-ball.r/2) {
        if (ball.y - Paddle.y > 0) {
            // too late!
            return;
        }
        if (ball.x>Paddle.x && ball.x<Paddle.x+Paddle.rx){
            ball.vy=-ball.vy;
            ball.vx=-2;
        }
        if (ball.x>Paddle.x+Paddle.rx && ball.x<Paddle.x+2*Paddle.rx){
            ball.vy=-ball.vy;
        }
        if (ball.x>Paddle.x+2*Paddle.rx && ball.x<Paddle.x+3*Paddle.rx){
            ball.vy=-ball.vy;
            ball.vx=2;
        }
    } 
}

function movePaddle(Paddle) {
    if (keyIsDown(LEFT_ARROW)) {
        Paddle.x= Paddle.x-5;
        if (Paddle.x<0){
            Paddle.x=0;
        }
    }
    
    if (keyIsDown(RIGHT_ARROW)) {
        Paddle.x= Paddle.x+5;
        if (Paddle.x>bx-3*Paddle.rx) {
            Paddle.x=bx-3*Paddle.rx;
        }    
    }          
}

function draw(){
    //Background
    background(200, 200, 220);

    // Check Gameover
    if(gameover) {
        textSize(48);
        text("Game Over", 70,300)
        return;
    }

    // Level display
    textSize(24);
    fill(0);
    text("Level " + level, 140,20)

    //Ball
    drawBall(ball);
    moveBallAndCheckBorders(ball);
    handleBallPaddleCollisions(ball,Paddle);

    //Paddle
    drawPaddle(Paddle);
    movePaddle(Paddle);

    //Bricks
    drawBricks();
    checkBricks();
}

