
// canevas configuration
var h=600;
var w=1200;
var fr=30; // framerate

var cx = w/2;
var cy = h/2;

var zoom = 0.5;
var targetZoom= zoom;
var zoomStep = 0.001;

var planets=[];

var G=9.8;
var maxSize = 50;

var pauseBtn;
var paused = false;
var autoFrameEnabled=true;
var mouseMode = null;

var speedBtn;
var displaySpeed=false;

function _createAndPositionPlanet(planets, sun) {

  var p = new Planet((1/3 + 2/3*random())*maxSize);
  do {
    var theta = 2*Math.PI * random();
    var r= sun.size * ( 2+ 8*random()) ;

    var v1 = createVector(sun.pos.x+r*Math.cos(theta), sun.pos.y+r*Math.sin(theta));
    var v2 = createVector(Math.cos(Math.PI/2*0.9+theta), Math.sin(Math.PI/2*0.9+theta));
    v2.normalize();
    v2.mult(15000*(1.5+1.5*random()));

    p.pos = v1;
    p.v = v2;

  } while (p.isColliding(planets))
  planets.push(p)
  return p;

}

function _createPlanetSystem(planets, sun, nbPlanets, hue ) {
    
    // create satelites Planets
    for (var i=0; i < nbPlanets; i++) {
      var p = _createAndPositionPlanet(planets, sun);
      p.color= color(hue, 30 + 60*random(), 30 + 60*random());      
    }
  
}

function createSystem(planets, centerObject, r, theta, starSize, starDensity, starHue, nbPlanets, hue) {

  var sun = new Planet(starSize);
  sun.density=starDensity;
  sun.computeMass();
  sun.color = color(starHue,70,90);

  var v1 = createVector(r*Math.cos(theta), r*Math.sin(theta));

  if (centerObject) {
    v1.add(centerObject.pos);
  }
  sun.pos = v1;

  //var v2 = createVector(Math.cos(Math.PI/2*0.9+theta), Math.sin(Math.PI/2*0.9+theta));
  //v2.mult(15000*(1.5+3*random()));
  //sun.v = v2;
  
  planets.push(sun);

  _createPlanetSystem(planets, sun,nbPlanets, hue);

  return sun;

}

function setup() {
  var cv =createCanvas(w, h);
  cv.parent("holder");
  frameRate(fr);
  colorMode(HSB, 360, 100, 100, 1);

  // ui seetings
  pauseBtn = createButton('Pause');
  pauseBtn.position(w +10, 5);
  pauseBtn.mousePressed(togglePause);

  speedBtn = createButton('Show Speed');
  speedBtn.position(w +10, 35);
  speedBtn.mousePressed(toggleSpeedVector);

  zoomBtn = createButton('Auto Zoom is On');
  zoomBtn.position(w +10, 65);
  zoomBtn.mousePressed(toggleAutoFrame);

  // create a few planetary systems
  var sun = createSystem(planets,null, 0, 0, maxSize*3.5, 5, 35, 50,100);
  var sun2 = createSystem(planets,sun, 2000, 3*Math.PI/4, maxSize*2, 3, 45, 20,200);
  var sun3 = createSystem(planets,sun, 3000, Math.PI/6, maxSize*3, 4, 40, 15,150);
  var sun4 = createSystem(planets,sun, 4000, -Math.PI/6, maxSize*1.5, 4, 40, 10,80);

  autoFrame(true);
  zoom = targetZoom;
}

function updateAndDrawPlanets() {

  for (var i=0; i < planets.length; i++) {    
    if (!paused) {
      planets[i].computeMove(planets);
      planets[i].move(1/fr);
    }
    planets[i].draw();    
  }
  planets = planets.filter(function(value, index, arr) {return !value.dead});

}

function autoFrame(force) {

  if (autoFrameEnabled || force) {
    computeTargetZoom();
    if (zoom < targetZoom-2*zoomStep) {
      zoom += zoomStep;
    } else if (zoom > targetZoom +2*zoomStep) {
      zoom -= zoomStep;
    }
    if (cx < targetCx - 5) {
      cx+=1;
    } else if (cx > targetCx + 5) {
      cx-=1;
    }
    if (cy < targetCy - 5) {
      cy+=1;
    } else if (cy > targetCy + 5) {
      cy-=1;
    }
  }

  resetMatrix();
  scale(zoom);
  translate(w/2/zoom-cx,h/2/zoom-cy);  
  

}

function draw() {

  background(200,50,10);
  
  autoFrame();
  updateAndDrawPlanets();

  //fill(color('rgb(255,0,0)'));
  //circle(cx,cy,100);
}


function togglePause() {
  paused=!paused;
  if (paused) {
    pauseBtn.elt.innerText="Resume";
  } else {
    pauseBtn.elt.innerText="Pause";
  }
}

function toggleAutoFrame() {
  autoFrameEnabled=!autoFrameEnabled;
  if (autoFrameEnabled) {
    zoomBtn.elt.innerText="Auto Zoom is On";
  } else {
    zoomBtn.elt.innerText="Auto Zoom is Off";
  }
}


function toggleSpeedVector() {
  displaySpeed=!displaySpeed;
  if (displaySpeed) {
    speedBtn.elt.innerText="Hide Speed";
  } else {
    speedBtn.elt.innerText="Show Speed";
  }
}

function computeTargetZoom() {

  var maxX = planets[0].pos.x;
  var maxY = planets[0].pos.y;
  var minX = planets[0].pos.x;;
  var minY = planets[0].pos.y;;

  for (var i=0; i < planets.length; i++) {    
      if (planets[i].pos.x>maxX) {
        maxX = planets[i].pos.x;
      }
      if (planets[i].pos.y>maxY) {
        maxY = planets[i].pos.y;
      }
      if (planets[i].pos.x<minX) {
        minX = planets[i].pos.x;
      }
      if (planets[i].pos.y<minY) {
        minY = planets[i].pos.y;
      }
    }
  
  var zx = (w)/(maxX*1.1-minX*1.1);
  var zy = (h)/(maxY*1.1-minY*1.1);
  var z = Math.min(zx,zy);

  targetZoom=Math.round(z * 100) / 100;

  targetCx =  + Math.round((maxX+minX)/2);
  targetCy =  + Math.round((maxY+minY)/2);

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
