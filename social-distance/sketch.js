
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

        //  70 => houses
        //  13 => shops
        //  10 => company
        //  05 => schools
        //  02 => hospital

        var btype=BType.HOUSE;
        var n = 1;
        if (p < 70) {
          // house
          btype=BType.HOUSE;
          n=1+ Math.round(Math.random()*2);
        } else if (p < 83) {
          // shop
          btype=BType.SHOP;
          n=1+ Math.round(Math.random()*1);
        } else if (p < 93) {
          // company
          btype=BType.COMPANY;
          n=1+ Math.round(Math.random()*1);
        } else if (p < 98) {
          // schools
          btype=BType.SCHOOL;
          n=1;
        } else if (p <= 100) {
          // hospital
          btype=BType.HOSPITAL;
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

  while(people.length<1) {
    var idx = Math.floor(Math.random()*buildings.length);
    if (buildings[idx].type==BType.HOUSE) {
      var nb = 1+ Math.random()*2;
      for (var i=0; i<nb; i++) {
        var p = new Person(buildings[idx], 20);
        var targetIdx= Math.floor(Math.random()*buildings.length);
        p.setTarget(buildings[targetIdx]);
      }      
    }
  }  

}

function drawCity() {

  for (var t =0; t < tiles.length; t++) {
    tiles[t].travelers=[];
  }
  for (var p =0; p < people.length; p++) {
    people[p].update();
  }
  for (var t =0; t < tiles.length; t++) {
    tiles[t].draw();
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

  if (startT) {
    fill(color(0,255,0));
    circle((startT.center.x+0.5)*tiles.tileWidth, (startT.center.y+0.5)*tiles.tileWidth, 10);
  }
  if (endT) {
    fill(color(255,0,0));
    circle((endT.center.x+0.5)*tiles.tileWidth , (endT.center.y+0.5)*tiles.tileWidth, 10);
  }
  if (startT && endT) {
    var p = new Person(startT, 10);
    var path = p.computePath(endT);
    for (var i = 0; i < path.length; i++) {
      fill(color(255,0,255));
      circle((path[i].x+0.5)*tiles.tileWidth , (path[i].y+0.5)*tiles.tileWidth, 10);
  
    }
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
    if (keyIsDown(83)) {
      startT = findTile(mouseX, mouseY);
    }
    else if (keyIsDown(69)) {
      endT = findTile(mouseX, mouseY);
    }
    else if (keyIsDown(CONTROL)) {
      mouseMode = "ZOOM";
    } else {
      mouseMode = "MOVE";
    }
  }
  else if (mouseButton==RIGHT) {
    mouseMode = "ZOOM";
  }

}
