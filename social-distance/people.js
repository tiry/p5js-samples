//**************************

var people=[];

var PEOPLE_BASE_SPEED = 1;

class Person {

  constructor(home, age) {

    this.age = age;
    
    // attach to home
    this.home = home;      
    home.people.push(this);

    // start at home
    this.currentLocation = home;

    // reference in global population
    this._id = people.length;    
    people.push(this);

    // physics depending on age
    this.speedFactor=PEOPLE_BASE_SPEED *(2 - age/100); 
    this.size = 8;
    if (age < 14) {
      this.size = this.size*0.8;
    }

    // init activity scheduling
    this._assignWork();
    this.schedule = new Schedule(this);

    // I am not sick for now!
    this.virus=null;
    this.dead=false;

    // init move tracking structures
    this.departureTime=0;
    this.moving=false;
    this.movingPosition={x:0,y:0, curTile:null, nextTile:null};

    // people around me for a long time
    this.followers={};

  }

  isInfectious() {
      if (this.virus) return this.virus.isInfectious();
      return false;
  }

  isSick() {
      if (this.virus) return this.virus.isSick();
      return false;
  }

  isRecovered() {
    if (this.virus) return this.virus.isRecovered();
    return false;
  }

  _assignWork() {
    this.work=null;
    if (this.age >= 65) {
      if (Math.random()>0.5) return;
    }    
    while(!this.work) {
      var i = Math.floor(Math.random()*(buildings.length-1));
      var b = buildings[i];
      if (this.age < 20 && b.type==BType.SCHOOL) {
        this.work=b;
      } else if (this.age >= 20 && (b.type==BType.SHOP || b.type==BType.COMPANY)) {
        this.work=b;
      } 
    }
  }

  // locate exit time from the given building position
  _findExit(cx,cy) {
    // find exit;
    if (cy-1>=0 && getTile(cx,cy-1).isEmpty()) {
      return {x: cx, y: cy-1};
    }
    else if (cy+1<= tiles.WY && getTile(cx,cy+1).isEmpty()) {
      return {x: cx, y: cy+1};
    }
    throw "can not find exit from tile " + cx + ',' + cy;
  }

  // compute the steps to go from one time to an other
  _walk(start, end, path) {
    var cx = start.x;
    var cy = start.y;

    if (cy-end.y==0) {
      var dx = end.x - cx;      
      for (var i = 1; i <= Math.abs(dx); i++) {
        path.push({x: (cx + i*dx/Math.abs(dx)), y: cy});
      }
      return;
    }

    var dy = Math.sign(end.y-cy);

    // first move to the first vertical road
    var dx = Math.sign(end.x-cx);
    if (dx==0) {
      dx=1;
    }
    do {
      cx +=dx;
      path.push({x: cx, y: cy});
    } while (!getTile(cx, cy+dy).isEmpty())

    // then move vertically
    do {
      cy +=dy;
      path.push({x: cx, y: cy});
    } while (cy != end.y)

    return this._walk({x: cx, y: cy}, end, path);
  }

  // compute steps to go to a given destination
  // call _walk
  computePath(dest) {
    var path = [];

    var cx = this.currentLocation.tile.center.x;
    var cy = this.currentLocation.tile.center.y;

    path.push({x: cx, y: cy});

    // find exit;    
    var start = this._findExit(cx,cy);
    path.push(start);
    
    // find entry point;
    var end = this._findExit(dest.center.x,dest.center.y);    

    this._walk(start, end, path);
    path.push(end);

    return path;
  }

  // set the destination and init the path to get there
  setTarget(destinationBuilding) {
    this.departureTime=frameCount;
    this.destinationBuilding = destinationBuilding;
    var dest = destinationBuilding.tile;
    this.path = this.computePath(dest);
    this.moving=true;
  }

  // get current speed
  _speed() {
    var s = Math.floor(fr/this.speedFactor);
    if (this.isSick()) {
      s=s*0.6;
    }
    return s;
  }

  update() {
    
    // no walking dead here!
    if (this.dead) return;

    if (this.moving) {
      var f = frameCount - this.departureTime;
      if (this.startPos == null || f%(this._speed())==0) {
        var step = Math.floor(f/(this._speed()));
        if (step < this.path.length) {
          var curTile = getTile(this.path[step].x, this.path[step].y);
          curTile.travelers.push(this);
          this.movingPosition.curTile = curTile;
          var nextTile; 
          if (step+1 < this.path.length) {
            nextTile = getTile(this.path[step+1].x, this.path[step+1].y).travelersNext;
          } else {
            nextTile = this.destinationBuilding.tile.travelersNext;
          }
          nextTile.push(this);
          this.movingPosition.nextTile = nextTile;
        } else {
          this.setLocation(this.destinationBuilding);
          this.destinationBuilding=null;
          this.moving=false;
        }
      }
    } else {      
        if (frameCount%(this._speed())==0) {
          var target = this.schedule.getTargetLocation();
          if (!(target===this.currentLocation)) {
            this.setTarget(target);
            this.update();
          }
        }
    }
  }

  // retrieves _id of people around me
  _getPeopleAroundMe() {
    var l = [];
    if (!this.moving) {
      // find people in the same building      
      var t = this.currentLocation.people;
      for (var i = 0; i < t.length; i++) {
        var p = t[i];
        if (p._id != this._id) {
          l.push(p._id);
        }
      } 

    } else {
      // find people moving in the same tile      
      var t = this.movingPosition.curTile.travelers;
      for (var i = 0; i < t.length; i++) {
        var p = t[i];
        if (p._id != this._id) {
          l.push(p._id);
        }
      } 
      t = this.movingPosition.nextTile.travelersNext;
      for (var i = 0; i < t.length; i++) {
        var p = t[i];
        if (p._id != this._id) {
          l.push(p._id);
        }
      }      
    }
    return l;
  }

  _spread() {
    if (frameCount%(fr*10)==0) {
        // XXX
        // gather close neighbors
        // infect if present during several round
    }
  }

  // set my current location
  setLocation(building) {
    if (this.currentLocation) {
      this.currentLocation.people = this.currentLocation.people.filter(function (v, i, a){return !v===this});
      this.currentLocation = building;
      building.people.push(this);
    }    
  }

  // define coordinate for current path segment
  setTrajectory(x,y,beginning) {
    if (beginning) {
      this.startPos = {x: x, y: y};
    } else {
      this.endPos = {x: x, y: y};
    }
  }

  // get my current color
  getColor() {
    if (this.dead) {
      return color(20,20,20);
    }
    if (this.isSick()) {
      return color(255,0,0)
    }
    if (this.isInfectious()) {
      return color(200,0,0)
    }
    if (this.virus) {
      if (this.isRecovered()) {
        return color(0,200,0)
      } else {
        return color(160,0,0)
      }
    }

    if (this.age < 20) {
      return color(0,200,200);
    } else if (this.age < 65) {
      return color(0,0,200);
    } else {
      return color(0,0,130);
    }  
  }

  // interpolate position on the current path segment
  _interpolateCurrentPosition() {

    if (!this.moving) {
      return;
    }
    var s = this._speed();
    var f = (frameCount - this.departureTime)%s;

    var x = (1-f/s)*this.startPos.x;
    var y = (1-f/s)*this.startPos.y;

    if (this.endPos) {
      x += (f/s)*this.endPos.x;
      y += (f/s)*this.endPos.y;          
    } else {
      x += (f/s)*this.destinationBuilding.tile.center.x;
      y += (f/s)*this.destinationBuilding.tile.center.y;  
    }
    
    this.movingPosition.x=x;
    this.movingPosition.y=y
    return this.movingPosition;
  }

  draw() {
    if (!this.moving) {
      return;
    }
    var cp = this.  _interpolateCurrentPosition();
    fill(this.getColor());    
    circle(cp.x, cp.y, this.size);
  }

}

