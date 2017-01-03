
// constants
var X_MAX = 2400;
var Y_MAX=1200;
var GRID_STEPS = 10;
var FOOD_COUNT = 50;

// global variables
var segments = [];
var startButton;

var alphaStep=5;
var alphaValue=0;
var alphaBreak=45;

var zoomCentrerX;
var zoomCentrerY;

var drawMediatrice = false;

var zoomLevel=1;

function computeEdge(segment, alpha) {

   var midX = (segment.x1 + segment.x2)/2.0;
   var midY = (segment.y1 + segment.y2)/2.0;

   // distance between edge and central point
   var d = Math.sqrt(Math.pow((segment.x1-midX),2) + Math.pow((segment.y1-midY),2));

   // tan(alpha) = h/d
   // h^2 = d^2 * tan(alpha)^2  = R
   var rad = alpha * Math.PI/180;
   var R = Math.pow(d,2) * Math.pow(Math.tan(rad),2); 
   
   // if aligned on X axis
   if (segment.y2-segment.y1==0) {    
      return {x:midX, y:midY - Math.sqrt(R)};
   }
   // mediatrice : y = ax+b
   var a = (segment.x1-segment.x2+0.0)/(segment.y2-segment.y1);
   var b = (Math.pow(segment.x2,2)-Math.pow(segment.x1,2) + Math.pow(segment.y2,2)-Math.pow(segment.y1,2))/(2*(segment.y2-segment.y1));

  if (drawMediatrice) {
    stroke(0,255,0);
    var previous = {x: 0, y: b};
    for (var i = 0; i < 1000; i=i+20) {
      var newPoint = {x: i, y: a*i+b};
      if (previous.x) {
        line(previous.x, previous.y, newPoint.x,newPoint.y);
      }
      previous = newPoint;
    }
  }
 
   // h^2 = R = (midX-x)^2 + (midY-y)^2
   var f = (R - Math.pow(midX,2) -Math.pow((b - midY),2)) / (1+Math.pow(a,2));
   f = f + (Math.pow((a*(b-midY)-midX),2))/ (Math.pow((1+Math.pow(a,2)),2));

   var g = (a*(b-midY) - midX)/(1+Math.pow(a,2));

   var sign=1;
/*   if (segment.x1 > segment.x2) {
      sign=-sign;
   }*/
   if (segment.y1 > segment.y2) {
      sign=-sign;
   }
   
   var x = sign*Math.sqrt(f)-g;

   var y = a*x + b;

   return {x:x, y:y};
}

function mkSegment(x1,y1,x2,y2) {
  return {
    x1: x1,
    y1:y1,
    x2: x2,
    y2:y2,    
  }
}

function setup() {

 createCanvas(X_MAX,Y_MAX);
 frameRate(5);

 var cx=X_MAX/2;
 var cy=Y_MAX/2+50;

 zoomCentrerX=cx;
 zoomCentrerY=cy;

 var R = 320;
 var steps = 8;

 for (var i = 0; i <steps; i++) {

     var rad =  i*(2*Math.PI/steps);

     var x1 = R*Math.cos(rad);
     var y1 = R*Math.sin(rad);

     rad =  (i+1)*(2*Math.PI/steps);

     var x2 = R*Math.cos(rad);
     var y2 = R*Math.sin(rad);

     segments.push(mkSegment(cx+x1,cy+y1,cx+x2,cy+y2));
 } 

// segments.push(mkSegment(cx-100,cy-100,cx-100,cy+100));
 //segments.push(mkSegment(cx-100,cy+100,cx+100,cy+100));
 //segments.push(mkSegment(cx+100,cy+100, cx+100,cy-100));
 //segments.push(mkSegment(cx+100,cy-100, cx-100,cy-100));

}

function pX(x) {  
   var amp = X_MAX/zoomLevel;   
   var minX = zoomCentrerX-amp/2;
   return (x-minX)*zoomLevel;
}
function pY(y) {  
   var amp = Y_MAX/zoomLevel;   
   var minY = zoomCentrerY-amp/2;
   return (y-minY)*zoomLevel;
}

function isVisible(segment) {

   var ampX = X_MAX/zoomLevel;   
  
   if ((segment.x1> zoomCentrerX+ampX/2) || (segment.x1< zoomCentrerX-ampX/2)) {
      return false;
   }
   if ((segment.x2> zoomCentrerX+ampX/2) || (segment.x2< zoomCentrerX-ampX/2)) {
      return false;
   }
   var ampY = Y_MAX/zoomLevel;   

   if ((segment.y1> zoomCentrerY+ampY/2) || (segment.y1< zoomCentrerY-ampY/2)) {
      return false;
   }
   if ((segment.y2> zoomCentrerY+ampY/2) || (segment.y2< zoomCentrerY-ampY/2)) {
      return false;
   }

   return true;
}

function draw() {

  background(255,255,255);

  stroke(0,0,0);

//  alphaValue+=alphaStep;
  var newSegments=[];

  for (var i =0; i < segments.length; i++) {
    if (isVisible(segments[i])) {
      line(pX(segments[i].x1),pY(segments[i].y1),pX(segments[i].x2),pY(segments[i].y2));
    }
  }

  if (alphaValue>0) {
    for (var i =0; i < segments.length; i++) {
      if (isVisible(segments[i])) {
        var edge = computeEdge(segments[i], alphaValue);
        newSegments.push(mkSegment(segments[i].x1, segments[i].y1, edge.x, edge.y));
        newSegments.push(mkSegment(edge.x, edge.y,segments[i].x2, segments[i].y2));          
      }
    }

 //    console.log(newSegments);

    stroke(255,0,0);

    for (var i =0; i < newSegments.length; i++) {
      line(pX(newSegments[i].x1),pY(newSegments[i].y1),pX(newSegments[i].x2),pY(newSegments[i].y2));
    }

     if (alphaValue>=alphaBreak) {
        segments = newSegments;
        alphaValue = 0;
     }
   }
}


function keyPressed() {
 if (keyCode === LEFT_ARROW) {
    if (keyIsDown(SHIFT)) {
      zoomCentrerX-=10;
    } else {
        zoomLevel-=0.1  
    }
} else if (keyCode === RIGHT_ARROW) {
    if (keyIsDown(SHIFT)) {
      zoomCentrerX+=10;
    } else {
      zoomLevel+=0.1;
    }
} else if (keyCode === UP_ARROW) {
    if (keyIsDown(SHIFT)) {
      zoomCentrerY-=10;
    } else {
       alphaValue+=alphaStep;  
    }
} else if (keyCode === DOWN_ARROW) {
    if (keyIsDown(SHIFT)) {
       zoomCentrerY+=10;
    } else {
       alphaValue-=alphaStep;  
    }
}
}
