
// constants
const GRID = {
    X_MAX : 1000,
    Y_MAX : 800,
    STEPS : 10
}

var X_MAX = 1000;
var Y_MAX=800;
var GRID_STEPS = 10;
var FOOD_COUNT = 50;

// global variables
var snake;
var food;
var startButton;

function setup() {
 createCanvas(GRID.X_MAX,GRID.Y_MAX);
 frameRate(30);

 startButton = createButton('Start Game');
 startButton.position(GRID.X_MAX/2-150, GRID.Y_MAX-250);
 startButton.style("font-size", "48px");
 startButton.style("font-style", "bold");   
 startButton.mousePressed(startGame);
}

function startGame() {  
 snake = new Snake(GRID.X_MAX/2,GRID.Y_MAX/2, GRID.STEPS);
 food = new Food(GRID,50);
 startButton.style("display", "none");
}

function draw() {
  if (!snake || !snake.isAlive()) return;

  background(240,250,240);

  snake.moveAndEat(food.getItems());
  snake.draw();
  food.draw();

  if (!snake.isAlive()) {
    gameOver();
  }  
}

function gameOver() {
 fill(color(0,0,0));     
 textSize(128);
 text("Game Over", 150,350)
 startButton.style("display", "block");
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
