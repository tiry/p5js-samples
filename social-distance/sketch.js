
// optimizations?
p5.disableFriendlyErrors=false;

// canevas configuration
var h=620;
var w=1280;
var fr=12; // framerate

var cy = h;
var cx = w;

var zoom = 0.45;
var targetZoom= zoom;
var zoomStep = 0.001;

// UI settings
var pauseBtn;
var paused = false;
var displayStatsBtn;
var showStats = true;
var displayLegendBtn;
var showLegend = true;
var autoFrameEnabled=true;
var mouseMode = null;
var speedSlider;
var selectScenario;

var simulationCompleted=false;

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);

  // ui setup
  pauseBtn = createButton('Pause');
  pauseBtn.position(w +10, 5);
  pauseBtn.mousePressed(togglePause);

  displayStatsBtn = createButton('Hide Stats');
  displayStatsBtn.position(w +10, 30);
  displayStatsBtn.mousePressed(toggleDisplayStats);

  displayLegendBtn = createButton('Hide Legend');
  displayLegendBtn.position(w +10, 55);
  displayLegendBtn.mousePressed(toggleDisplayLegend);

  speedSlider = createSlider(0, 5, 1, 1);
  speedSlider.position(w +10, 80);
  speedSlider.style('width', '80px');

  selectScenario=createSelect();
  selectScenario.position(w +10, 105);
  selectScenario.style('width', '200px');
  for (var i = 0; i < scenarios.length; i++) {
    selectScenario.option(scenarios[i].title);
  }

  setupPolicyUI();

  selectScenario.changed(function(e) {
    startSimulation();
  });

  // init Simulation
  startSimulation();
}

function startSimulation() {
  resetSimulation();  
  activateScenario(selectScenario.value());
  simulationCompleted=false;
}

function resetSimulation(){
  buildings=[];
  people=[];
  initStats();
  timeCounter=0;
  paused=false;
  initCityLayout();
}

function draw() {

  var t0=millis();

  if (simulationCompleted) {
    displaySummary();
    paused=true;
    return;
  }

  
  if (!paused) tick();

  background(255,255,255);

  resetMatrix();
  scale(zoom);
  translate(w/2/zoom-cx,h/2/zoom-cy);    

  drawCity();

  resetMatrix();

  text("FR:" + Math.round(frameRate()), 5 , 15);  

  if (showStats) displayStats();
  if (showLegend) displayBuildingLegend();

  simulationCompleted = isSimulationCompleted();

}

function toggleDisplayLegend() {
  showLegend=!showLegend;
  if (showLegend) {
    displayLegendBtn.elt.innerText="Hide Legend";
  } else {
    displayLegendBtn.elt.innerText="Show Legend";
  }
}

function toggleDisplayStats() {
  showStats=!showStats;
  if (showStats) {
    displayStatsBtn.elt.innerText="Hide Stats";
  } else {
    displayStatsBtn.elt.innerText="Show Stats";
  }
}

function togglePause() {
  paused=!paused;
  if (paused) {
    pauseBtn.elt.innerText="Resume";
  } else {
    pauseBtn.elt.innerText="Pause";
  }
}

function mouseReleased(event) {
  mouseMode = null;
}

function mouseDragged(event){
  if (mouseX > w || mouseY > h) {
    return;
  }
  if (mouseMode == "MOVE") {
    cx += event.movementX;
    cy += event.movementY;
  } else if (mouseMode == "ZOOM") {
    //console.log("zoom + " + event.movementY/10.0);
    zoom += Math.sign(event.movementY)*0.01;
  }
}

function mousePressed(event) {  
  if (mouseButton==LEFT) {
    if (keyIsDown(CONTROL)) {
      mouseMode = "ZOOM";
    } else {
      mouseMode = "MOVE";
    }
  }
  else if (mouseButton==RIGHT) {
    mouseMode = "ZOOM";
  }
}
