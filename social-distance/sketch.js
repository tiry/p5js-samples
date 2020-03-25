
// canevas configuration
var h=620;
var w=1280;
var fr=20; // framerate

var cx = w/2;
var cy = h/2;

var zoom = 1.0;
var targetZoom= zoom;
var zoomStep = 0.001;

var pauseBtn;
var paused = false;
var autoFrameEnabled=true;
var mouseMode = null;

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);

  // ui seetings
  pauseBtn = createButton('Pause');
  pauseBtn.position(w +10, 5);
  pauseBtn.mousePressed(togglePause);

  // init Tiles
  initCityLayout();

  initPopulation();
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
        //  02 => hospital
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
        } else if (p < 87) {
          btype=BType.HOSPITAL;
          n=1;
        } else if (p < 90) {
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

function initPopulation() {

  for (var idx=0; idx < buildings.length; idx++) {
    if (buildings[idx].type==BType.HOUSE) {

      //children
      var nb = Math.round(Math.random()*2.6);
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 5 + Math.floor(Math.random()*25));
      }
      //parents
      nb = Math.round(1+ Math.random()*1.4);
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 20 + Math.floor(Math.random()*45));
      }
      //gd parents
      nb = Math.round(Math.random()*1.55);
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 20 + Math.floor(Math.random()*45));
      }

    }
  }

}

function drawCity() {

  for (var t =0; t < tiles.length; t++) {
    tiles[t].resetTravelers();
  }
  for (var p =0; p < people.length; p++) {
    people[p].update();
  }
  for (var t =0; t < tiles.length; t++) {
    tiles[t].draw();
    tiles[t].positionTraverlers();
  }  

  for (var p =0; p < people.length; p++) {
    people[p].draw();
  }  

}


var startT=null;
var endT=null;

function draw() {

  background(255,255,255);

  resetMatrix();
  scale(zoom);
  translate(w/2/zoom-cx,h/2/zoom-cy);    

  drawCity();
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
