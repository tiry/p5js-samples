// http://codepen.io/maxpowa/pen/VKXmrW

// constants
var X_MAX = 1000;
var Y_MAX=800;
var GRID_STEPS = 10;
var FOOD_COUNT = 50;

// global variables
var snake;
var food = [];
var startButton;

function setup() {
 createCanvas(X_MAX,Y_MAX);
 frameRate(30);

 startButton = createButton('Start Game');
 startButton.position(X_MAX/2-150, Y_MAX-250);
 startButton.style("font-size", "48px");
 startButton.style("font-style", "bold");   
 startButton.mousePressed(startGame);
}

function startGame() {  
 snake = new Snake(X_MAX/2,Y_MAX/2, GRID_STEPS);
 generateFood();
 startButton.style("display", "none");
}

function draw() {
  if (!snake || snake.dead) return;

  background(240,250,240);

  snake.move();
  snake.draw();
  
  drawFood();

  if (snake.dead) {
    gameOver();
  }  
}

function gameOver() {
 fill(color(0,0,0));     
 textSize(128);
 text("Game Over", 150,350)
 startButton.style("display", "block");
}

function drawFood() {
  for (var i = 0; i < food.length; i++) {
   if (!food[i].used) {
    if (food[i].boost==1) {
      fill(color(100,food[i].color,100));     
    } else if (food[i].boost==2)  {
      fill(color(100,100,food[i].color));      
    } else {
      fill(color(food[i].color,100,100));      
    }
    noStroke();
    rect(food[i].x,food[i].y,GRID_STEPS,GRID_STEPS);
  }
}  
}

function generateFood() {
  for (var i = 0; i < FOOD_COUNT; i++) {
   f = {
     color : random(255),
     x : GRID_STEPS * random(X_MAX/GRID_STEPS),
     y : GRID_STEPS * random(X_MAX/GRID_STEPS),
     used : false,
     boost: random([1,2,4])
   }
   food.push(f);
 }
}

function keyPressed() {
 if (keyCode === LEFT_ARROW) {
  snake.changeDirection(-1,0);
} else if (keyCode === RIGHT_ARROW) {
  snake.changeDirection(1,0);
} else if (keyCode === UP_ARROW) {
  snake.changeDirection(0,-1);
} else if (keyCode === DOWN_ARROW) {
  snake.changeDirection(0,1);
}
}
