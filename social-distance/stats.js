var STATS_SIZE=100;
var statsData=[];

function displayStats() {
  if ((!paused) && (now().t%fr==0)) {
    statsData.push(VStats());
    if (statsData.length>STATS_SIZE) {
      statsData.shift();
    }
  }
  
  if (statsData.length==0) return;

  resetMatrix();
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
  _drawCurve(sx,sy+dh,"sain", color(0,0,255), dw, dh, tx);
  tx+=60;
  _drawCurve(sx,sy+dh,"infected", color(120,0,0), dw, dh, tx);
  tx+=80;
  _drawCurve(sx,sy+dh,"infectious", color(180,0,0), dw, dh, tx);
  tx+=90;
  _drawCurve(sx,sy+dh,"sick", color(255,0,0), dw, dh, tx);
  tx+=60;
  _drawCurve(sx,sy+dh,"recovered", color(0,255,0), dw, dh, tx);
  tx+=90;
  _drawCurve(sx,sy+dh,"dead", color(100,100,100), dw, dh, tx);

  tx = w-50;
  fill(color(0,0,0));
  stroke(color(0,0,0));
  
  var label = "R0: " + Number.parseFloat(statsData[statsData.length-1]["r0"]).toFixed(2);
  text(label, tx , sy+dh + 15);  

  tx = w-90;
  var tpc = Math.round(100*now().h/NB_H_PER_DAYS);
  var label = "Day: " + now().d + " (" + tpc + "%)";
  text(label, tx , 15);  


}

function _drawCurve(sx,sy, key, c, dw, dh, lx) {

  var dx = dw/STATS_SIZE;
  var dy = dh/people.length;

  var px = null;
  var py = null;

  stroke(c);
  for (var i=0; i < statsData.length; i++) {
    
    var x = sx + i*dx;
    var y = sy - statsData[i][key]*dy;
    
    if (px!=null && py!=null) {
      line(px, py, x, y);
    }
    px=x;
    py=y;
  }
  
  fill(c);
  if (statsData.length>0) {
    var label = key + ": " + statsData[statsData.length-1][key];
    text(label, lx , sy+15);  
  }
  

}
