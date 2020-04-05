var STATS_SIZE=200;
var statsData=[];
var allData=[];


var VStats = function() {

  // statistics computed by visiting population
  var r = {
    healthy: 0,
    infected: 0,
    infectious: 0,
    sick: 0,
    recovered: 0,
    dead: 0
  }

  var vCount=0;
  var replicateCount=0;

  for (var i=0; i < people.length; i++) {

    var p = people[i];
    if (p.virus) {
      if (p.wasInfectious()) {
          vCount++;
          replicateCount+=p.virus.replicats;    
      }
      if (p.isDead()) {
        r.dead+=1;
      } else {
        if (p.isRecovered()) {
          r.recovered++;
        } else {
          r.infected++;
          if (p.isInfectious()) {
            r.infectious+=1;
          }
          if (p.isSick()) {
            r.sick+=1;
          }  
        }
      }
    } else {
      r.healthy+=1;
    }
  }

  // compute actual R0
  r.r0=replicateCount/vCount;

  return r;
}

function initStats() {
  statsData=[];
  allData=[];
}

function _collectStats() {
  if ((!paused) && (now().t%fr==0)) {
    statsData.push(VStats());
    if (statsData.length>STATS_SIZE) {
      allData.push(statsData.shift());
    }
  }
}

function displayStats() {
  
  _collectStats();

  if (statsData.length==0) return;
  fill(color(255,255,255, 200));
  stroke(color(100,100,100));
  
  var dw=500;
  var dh=150;
  var sx = w-dw;
  var sy = 0;

  rect(sx, sy, w, dh);
  fill(color(220,220,220, 220));
  rect(sx, sy+dh, w, 20);

  var tx=sx+ 5;
  _drawCurve(statsData,sx,sy+dh,"healthy", color(0,0,255), dw, dh, tx);
  tx+=70;
  _drawCurve(statsData,sx,sy+dh,"infected", color(120,0,0), dw, dh, tx);
  tx+=80;
  _drawCurve(statsData,sx,sy+dh,"infectious", color(180,0,0), dw, dh, tx);
  tx+=90;
  _drawCurve(statsData,sx,sy+dh,"sick", color(255,0,0), dw, dh, tx);
  tx+=60;
  _drawCurve(statsData,sx,sy+dh,"recovered", color(0,255,0), dw, dh, tx);
  tx+=90;
  _drawCurve(statsData,sx,sy+dh,"dead", color(100,100,100), dw, dh, tx);

  tx = w-50;
  fill(color(0,0,0));
  stroke(color(0,0,0));
  
  var label = "R0: " + Number.parseFloat(statsData[statsData.length-1]["r0"]).toFixed(2);
  text(label, tx , sy+dh + 15);  

  tx = w-90;
  var tpc = Math.round(100*now().h/NB_H_PER_DAYS);
  var label = "Day: " + (1+now().d) + " (" + tpc + "%)";
  text(label, tx , 15);  
}


function displaySummary() {
  
  for (var i=0; i < statsData.length; i++) {
    allData.push(statsData[i]);
  }
  statsData=[];

  fill(color(255,255,255, 200));
  stroke(color(100,100,100));
  
  var sx = 20;
  var sy = 20;

  var dw=w-40;
  var dh=h-40;
  
  rect(20, 20, dw, dh);
  fill(color(220,220,220, 220));

  _drawCurve(allData, sx,sy+dh,"sick", color(255,0,0), dw, dh);
  _drawCurve(allData, sx,sy+dh,"recovered", color(0,255,0), dw, dh);
  _drawCurve(allData, sx,sy+dh,"dead", color(100,100,100), dw, dh);
  _drawCurve(allData, sx,sy+dh,"r0", color(0,0,255), dw, dh, null, 5);

  fill(color(0,0,0));
  stroke(color(0,0,0));
  

}

function isSimulationCompleted() {
  
  if (statsData.length<STATS_SIZE) return false;

  var lstat = statsData[statsData.length-1];

  // everyone is dead or recovered!
  if (lstat.recovered + lstat.dead == people.length) {
    return true;
  }

  if (_isMetricStable("sick")) {
    return true;
  }

  return false;
}

function _isMetricStable(name) {

  var i = statsData.length-1;
  var lastData = statsData[i][name];
  i--;
  while(i>=0) {
    if (statsData[i][name]!=lastData) {
      return false;
    }
    i--;
  }
  return true;
}

function _drawCurve(data, sx,sy, key, c, dw, dh, lx, maxY) {

  var nbSteps = Math.max(STATS_SIZE, data.length);
  if (!maxY) {
    maxY = people.length;
  }
  var dx = dw/nbSteps;
  var dy = dh/maxY;

  var px = null;
  var py = null;

  stroke(c);
  for (var i=0; i < data.length; i++) {
    
    var x = sx + i*dx;
    var y = sy - data[i][key]*dy;
    
    if (px!=null && py!=null) {
      line(px, py, x, y);
    }
    px=x;
    py=y;
  }
  
  fill(c);
  if (lx && data.length>0) {
    var label = key + ": " + data[data.length-1][key];
    text(label, lx , sy+15);  
  }
}
