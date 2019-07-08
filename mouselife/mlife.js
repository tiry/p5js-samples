
var space;

var runBtn;
var frameRateSlider;

var DEFAULT_FR=20;

var frLabel;

var runState;

var STAT_PAUSED=0;
var STAT_RUN=1;
var STAT_COMPLETED=2;

function setup (){

    initSpace();

    createCanvas(space.w, space.h);

    frameRate(DEFAULT_FR);
    angleMode(DEGREES);



    frLabel = createSpan(DEFAULT_FR + "fps");
    frLabel.position(1200, 10);

    frameRateSlider = createSlider(0, 60, 20, 1);
    frameRateSlider.position(1250, 10);
    frameRateSlider.style('width', '80px');
    frameRateSlider.mouseReleased(updateFrameRate);


    runBtn = createButton("Start");
    runBtn.position(1200, 40);
    runBtn.style('width', '80px');
    runBtn.mouseClicked(controlExecution);

    runState = STAT_PAUSED;

}

function initSpace() {

    space = new Space(1200,600, 40, 50);

}

function updateFrameRate() {
    frameRate(frameRateSlider.value());
    frLabel.html( frameRateSlider.value() + "fps");
}




function controlExecution(){

    
    if (runState==STAT_PAUSED) {
        runState=STAT_RUN;
        runBtn.html("Pause");
    } else if (runState==STAT_RUN) {
        runState=STAT_PAUSED;
        runBtn.html("Start");
    } else if (runState==STAT_COMPLETED) {
        runState=STAT_RUN;
        initSpace();
        runBtn.html("Pause");
    }

}

function mouseClicked(event) {
    space.click(createVector(event.offsetX, event.offsetY));
}

function draw() {

    if (runState==STAT_RUN) {
        if (!space.dead()) {
            clear(); 
            space.updateAndDraw();
        } else {        
            runState = STAT_COMPLETED;
            runBtn.label = "Restart";
        }        
    } if (runState==STAT_PAUSED) {
        
        space.updateAndDraw(true);

    }

}
