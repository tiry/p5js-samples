
class Snake {

    constructor(startx,starty, speed) {
        this.x =startx;
        this.y =starty;
        this.dead=false;
        this.tail=[];

        this.speed=speed;
        this.dirX=1;
        this.dirY=0;

        this.growPoints=0;
        this.nbMeal=0;
    }

    isAlive() {
        return !this.dead;
    }

    // *****************************
    // Make our Snake move forward
    move() {

        if (this.dead) {
          return false;
        }

        this.x+=this.dirX * this.speed;
        this.y+=this.dirY * this.speed;

        this._updateTail();
        this._grow();

        if (this._checkDie()) {
          this.dead=true;
        }

        this._checkBorders();

        return true;
    }

    moveAndEat(food){
        this.move();
        this._eatIfPossible(food);
        return true;
    }

    // *****************************
    _getPosition() {
        return { x: this.x, y: this.y}
    }

    // *****************************
    _updateTail() {
        if (this.tail.length>0) {
          this.tail.pop();
          this.tail.unshift(this._getPosition());
        }
        //this.extendTail();
    }

    // *****************************
    _extendTail() {

       var newTail = [];
       var lastPosition = this.tail[0];
       newTail.push(this.tail[0]);
       for (var i = 1; i < this.tail.length; i++) {
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

    // *****************************
    _checkDie() {
        for (var i = 3; i < this.tail.length; i++) {
          if (this._isCloseTo(this.tail[i].x, this.tail[i].y)) {
            return true;
          }
        }
        return false;
    }

    _grow() {
        if (this.growPoints>0) {
          this.growPoints--;
          this.tail.unshift(this._getPosition());
        }
    }

    _checkBorders () {
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

    changeDirection(x, y) {
        this.dirX =x;
        this.dirY =y;
    }

    _eatIfPossible(food) {
        let foodIndex = this._findFoodToEat(food);
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

    _isCloseTo(x, y) {
       let dx = Math.abs(this.x-x);
       let dy = Math.abs(this.y-y);
       if (dx < GRID_STEPS && dy < GRID_STEPS) {
        return true;
      }
      return false;
    }

    //return the index of the first food that is close enough to be eaten
    _findFoodToEat (food) {
        for (var i = 0; i < food.length; i++) {
         if (!food[i].used) {
           if (this._isCloseTo(food[i].x, food[i].y)) {
             return i;
           }
         }
       }
       return -1;
    }

    draw() {
      fill(color(255,0,0));
      noStroke();
        // draw tail
        this._drawTail();
        // draw head
        fill(color(255,0,0));
        rect(this.x,this.y,GRID_STEPS,GRID_STEPS);
    }

    _drawTail() {
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