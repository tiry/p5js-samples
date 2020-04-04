
// canevas configuration
var h=620;
var w=1280;
var fr=20; // framerate

var cy = h/2;
var cx = w/2;

var zoom = 0.8;
var targetZoom= zoom;
var zoomStep = 0.001;

var pauseBtn;
var paused = false;
var displayStatsBtn;
var showStats = true;

var displayLegendBtn;
var showLegend = true;

var autoFrameEnabled=true;
var mouseMode = null;

var speedSlider;

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);

  // ui seetings
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

  // init Tiles
  initCityLayout();

  initPopulation(20);
  //initDebugPopulation(10);
  //initDebugICU(5);
}

function initCityLayout() {

  var tw = 40;
  var roadX=8;
  var roadY=3;

  initTileSet(tw, Math.floor(w/tw), Math.floor(h/tw));

  for (var i = 0; i <= tiles.WX; i++) {
    for (var j = 0; j <= tiles.WY; j++) {
      var t = new Tile(createVector(i,j), tw);
      if (i%roadX!=0 && j%roadY!=0) {
        var p = Math.random()*100;

        //  55 => houses
        //  10 => shops
        //  15 => company
        //  05 => schools
        //  01 => hospital
        //  03 => venue
        //  10 => restaurant

        var btype=BType.HOUSE;
        var n = 1;
        if (p < 55) {
          btype=BType.HOUSE;
          n=1+ Math.round(Math.random()*1.6);
        } else if (p < 65) {
          btype=BType.SHOP;
          n=1+ Math.round(Math.random()*1);
        } else if (p < 80) {
          btype=BType.COMPANY;
          n=1+ Math.round(Math.random()*1);
        } else if (p < 85) {
          btype=BType.SCHOOL;
          n=1;
        } else if (p < 86) {
          btype=BType.HOSPITAL;
          n=1;
        } else if (p < 89) {
          btype=BType.VENUE;
          n=1;
        } else if (p <= 100) {
          btype=BType.RESTAURANT;
          n=1;
        }

        for (var idx = 0; idx < n; idx++) {
          var b = new Building(t, btype);
          b.idx = idx;
          t.deploy(b);
        }        
      }
    }
  }


}

function drawCity() {

  if (!paused) {
    for (var t =0; t < tiles.length; t++) {
      tiles[t].resetTravelers();
    }  
    for (var p =0; p < people.length; p++) {
      people[p].update();
    }
  }

  for (var t =0; t < tiles.length; t++) {
    tiles[t].draw();
    if (!paused) tiles[t].positionTraverlers();
  }  

  for (var p =0; p < people.length; p++) {
    if (!paused) people[p].position();
    people[p].draw();
  }  
}

function draw() {

  if (!paused) tick();

  background(255,255,255);

  resetMatrix();
  scale(zoom);
  translate(w/2/zoom-cx,h/2/zoom-cy);    

  drawCity();

  resetMatrix();

  if (showStats) displayStats();
  if (showLegend) displayBuildingLegend();
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
