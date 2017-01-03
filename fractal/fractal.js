function Snake(startx,starty, speed) {

  this.x =startx;
  this.y =starty
  this.dead=false;
  this.tail=[];  

  this.speed=speed;
  this.dirX=1;
  this.dirY=0;  

  this.growPoints=0;
  this.nbMeal=0;

  this.move = function() {

    if (this.dead) {
      return false;
    }
    
    this.x+=this.dirX * this.speed;
    this.y+=this.dirY * this.speed;

    this.updateTail();
    this.grow();

    if (this.checkDie()) {
      this.dead=true;
    }

    this.checkBorders();
    this.eatIfPossible();
    
    return true;
  }
  
  this.position = function() {
    return { x: this.x, y: this.y}
  }

  this.updateTail = function() {
    if (this.tail.length>0) {
      this.tail.pop();
      this.tail.unshift(this.position());
    }          
    //this.extendTail();
  }

  this.extendTail = function() {

   var newTail = [];   
   var lastPosition = this.tail[0];
   newTail.push(this.tail[0]);
   for (i = 1; i < this.tail.length; i++) {
       var deltaX = this.tail[i].x-lastPosition.x;
       var deltaY = this.tail[i].y-lastPosition.y;
       if (deltaX>0 && deltaY>0) {
        console.log("ERROR");
       }
       var threshold =  1.1*GRID_STEPS; 
       var delta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
       if (delta>threshold && delta < 4*threshold) {
           var nbPoints = Math.floor(Math.abs(deltaX/GRID_STEPS+ deltaY/GRID_STEPS)) +1;
         //console.log("expand " + nbPoints + " points " + (deltaX/(nbPoints+1.0)) + " " + deltaY/(nbPoints+1.0));
           for (j = 1; j <= nbPoints ; j++) {
               newTail.push( {x : lastPosition.x + Math.floor(j*deltaX/(nbPoints+1.0)),
                                        y : lastPosition.y + Math.floor(j*deltaY/(nbPoints+1.0)),
                                        padding : true});                 
           }
       }
       lastPosition = this.tail[i];
       newTail.push(this.tail[i]);
      }
   this.tail = newTail; 
   //console.log(this.tail.length);   
  }

  this.checkDie = function() {
    for (i = 3; i < this.tail.length; i++) {
      if (this.isCloseTo(this.tail[i].x, this.tail[i].y)) {
        return true;
      }
    }
    return false;  
  }

  this.grow = function() {
    if (this.growPoints>0) {
      this.growPoints--;
      this.tail.unshift(this.position());
    }    
  }

  this.checkBorders = function() {
    if (this.x>X_MAX) {
      this.x = 0;
    }
    if (this.y > Y_MAX) {
      this.y = 0;
    }
    if (this.x <0) {
      this.x=X_MAX;
    }
    if (this.y <0) {
      this.y=Y_MAX;
    }    
  }

  this.changeDirection = function (x,y) {
    this.dirX =x;
    this.dirY =y;    
  }

  this.eatIfPossible = function () {
    var foodIndex = this.findFoodToEat();
      // eat the food that was found
      if (foodIndex > 0) {
       food[foodIndex].used=true;
       this.nbMeal++;
       this.growPoints=food[foodIndex].boost;
       if (this.nbMeal%5==0) {
        this.speed=this.speed*(1+this.growPoints/10);
      }
      return true;      
    }
    return false;
  }

  this.isCloseTo = function (x,y) {
   var dx = Math.abs(this.x-x);
   var dy = Math.abs(this.y-y);
   if (dx < GRID_STEPS && dy < GRID_STEPS) {
    return true;
  }
  return false;
}

  //return the index of the first food that is close enough to be eaten
  this.findFoodToEat = function() {
    for (var i = 0; i < food.length; i++) {
     if (!food[i].used) {
       if (this.isCloseTo(food[i].x, food[i].y)) {
         return i;                  
       }
     }
   }  
   return -1;
 }

 this.draw = function() {

  fill(color(255,0,0));
  noStroke();      
    // draw tail
    this.drawTail();
    // draw head
    fill(color(255,0,0));
    rect(this.x,this.y,GRID_STEPS,GRID_STEPS);  
  }

  this.drawTail = function() {
    var lastPoint;
    for (var i = 0; i < this.tail.length; i++) {
      if (lastPoint) {
        stroke(128);
        //fill(color(128,128,128));
        line(lastPoint.x,lastPoint.y, this.tail[i].x, this.tail[i].y);
      }
      var idxColor = 50 +(150/this.tail.length)*i;
      fill(color(255,idxColor,idxColor));
      if (this.tail[i]) {
        if (this.tail[i].padding) {
            fill(color(128,128,128));
        }
        rect(this.tail[i].x,this.tail[i].y,GRID_STEPS,GRID_STEPS);
      }
      lastPoint = this.tail[i];
    }    
  }

}