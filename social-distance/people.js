//**************************

const HealthState =  {
  HEALTHY: 0,
  INCUBATION: 1,
  INFECTIOUS: 2,
  SICK: 3,
  RECOVERED: 4,
  DEAD: -1
}

var people=[];

var PEOPLE_BASE_SPEED = 2.5;
//var PEOPLE_BASE_SPEED = 0.5;

class Person {

  constructor(home, age) {

    this.age = age;    
    this.health = HealthState.HEALTHY;

    // attach to home
    this.home = home;      
    home.enter(this);

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

    // init move tracking structures
    this.departureTime=0;
    this.moving=false;
    this.movingPosition={x:0,y:0, curTile:null, nextTile:null};

    // people around me for a long time
    this.followers={};

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
      } else if (this.age >= 20 && (b.type==BType.SHOP || b.type==BType.COMPANY || b.type==BType.RESTAURANT || b.type==BType.HOSPITAL)) {
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
    this.departureTime=now().t;
    this.destinationBuilding = destinationBuilding;
    var dest = destinationBuilding.tile;
    this.path = this.computePath(dest);
    this.moving=true;
    this.leaveCurrentLocation();
  }

  // get current speed
  _speed() {
    var s = Math.floor(fr/(this.speedFactor*speedSlider.value()));
    if (this.isSick()) {
      s=Math.floor(s*0.6);
    }
    return s;
  }

  update() {
    this._checkHealth();
    this._update();    
  }

  position() {
    if (this.moving) {
      this._interpolateCurrentPosition();
    }
  }

  _checkHealth() {
    if (this.isDead() || this.isRecovered()) {
      return;
    }
    if (this.virus) {
      var stage = this.virus.getStage();
      if (stage < HealthState.RECOVERED) {
        this.health = stage;
      } else {
        if (this.virus.isFatal()) {
          this._die();
        } else {
          if (this.virus.isSevereForm()) {
            if (this._isInICU()) {
              this.health=HealthState.RECOVERED;
            } else {
              this._die();
            }
          } else {
            this.health=HealthState.RECOVERED;
          }
        }
      }
    }
  }

  _die() {
    this.health=HealthState.DEAD;
    this.leaveCurrentLocation();
    this.setLocation(this.home);
  }

  _update() {    
    // no walking dead here!
    if (this.isDead()) {
      this.currentLocation=this.home;
      this.moving=false;
      return;
    } 

    if (this.isInfectious()) {
      this._spread();
    }

    if (this.moving) {
      var f = now().t - this.departureTime;
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
          // we are at the end of the path
          if (!this.destinationBuilding.isFull()) {
            this.setLocation(this.destinationBuilding);
            this.destinationBuilding=null;
            this.moving=false;  
          } else {
            // redirect to a new location !
            var alternative = findClosest(this.getCurrentTile(), this.destinationBuilding.type, true);            
            if (alternative) {              
              this._changePlans(this.destinationBuilding, alternative);
            } else {
              this._changePlans(this.destinationBuilding, this.home);
            }
            this._update();
          }
        }
      }
    } else {      
        if (now().t%(this._speed())==0) {
          var target = this.schedule.getTargetLocation();
          if (!(target===this.currentLocation)) {
            this.setTarget(target);
            this._update();
          }
        }
    }
  }

  _changePlans(oldTarget, newTarget) {
    this.currentLocation= oldTarget;
    this.schedule.updateTarget(oldTarget, newTarget);
    this.setTarget(newTarget);
    // handle specific case for ICU
    if (this.icu && this.icu._id==oldTarget._id) {
      this.icu = newTarget;
    }
    this._update();
  }

  // get list of people that are around be for more than a given time
  _getLongTermNeighbors(threshold) {
    var p = [];

    var keys = Object.keys(this.followers);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (this.followers[key]>=threshold) {
        p.push(people[parseInt(key)]);
      }
    }
    return p;
  }

  // update the list of people around be for some time
  _updateFollower() {

    var currentPeopleIds = this._getPeopleAroundMe();

    // check who leaves the followship
    var leaversId=[];
    var keysToScan = Object.keys(this.followers);
    for (var i = 0; i < keysToScan.length; i++) {
      var keyId = parseInt(keysToScan[i]);
      if (!currentPeopleIds.includes(keyId)) {
        leaversId.push(""+keyId);        
      }
    }    

    // remove leavers
    for (var i = 0; i < leaversId.length; i++) {
      var key = leaversId[i];
      delete this.followers[key];
    }

    // update counters
    for (var i = 0; i < currentPeopleIds.length; i++) {
      var key = ""+currentPeopleIds[i];

      if (this.followers[key]) {
        this.followers[key]++;
      } else {
        this.followers[key]=1;
      }
    }
  }

  // retrieves _id of people around me
  _getPeopleAroundMe() {
    var l = [];
    if (!this.moving) {
      // find people in the same building      
      var t = this.currentLocation.getPeople();
      for (var i = 0; i < t.length; i++) {
        var p = t[i];
        if (p._id != this._id) {
          l.push(p._id);
        }
      } 
    } else {
      // find people moving in the same tile
      if (this.movingPosition.curTile) {      
        var t = this.movingPosition.curTile.travelers;
        if (t) {
          for (var i = 0; i < t.length; i++) {
            var p = t[i];
            if (p._id != this._id) {
              l.push(p._id);
            }
          } 
        }
      }
      if (this.movingPosition.nextTile) {
        t = this.movingPosition.nextTile.travelersNext;
        if (t) {
          for (var i = 0; i < t.length; i++) {
            var p = t[i];
            if (p._id != this._id) {
              l.push(p._id);
            }
          }      
        }
      }
    }
    return l;
  }

  _spread() {
    if (now().t%(fr*1)==0) {
      this._updateFollower();      
      var potentialVictims = this._getLongTermNeighbors(2);
      if (potentialVictims.length>0) {
        var nbVictims = Math.min(potentialVictims.length, 5);
        var infected =0;
        for (var i=0; i < potentialVictims.length; i++) {
          var victim = potentialVictims[i];  
          if (!victim.virus) {
            this.virus.infect(victim);
            infected++;
          }
          if (infected>=nbVictims) {
            break;
          }            
        }
        if (infected>1) {
          console.log("Super Spreader");
        }

      }
    }
  }

  leaveCurrentLocation() {
    if (this.currentLocation) {
      this.currentLocation.leave(this);
    }          
    this.currentLocation=null;
  }

  // set my current location
  setLocation(building) {
    this.currentLocation = building;
    building.enter(this);
  }

  _isInICU() {
    if (this.currentLocation) {
      return this.currentLocation.type==BType.HOSPITAL;
    } else {
      return false;
    }
  }

  // define coordinate for current path segment
  setTrajectory(x,y,beginning, tile) {
    if (beginning) {
      this.startPos = {x: x, y: y, t: tile};
    } else {
      this.endPos = {x: x, y: y, t:tile};
    }
  }

  getCurrentTile() {
    if (!this.moving) {
      return this.currentLocation.tile;
    }
    var r = this._getInterTilesPosition()
    if ( r <=0.5) {
      return this.startPos.t;
    } else {
      return this.endPos.t;
    }
  }

  // get my current color
  getColor() {
    if (this.isDead()) {
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

  _getInterTilesPosition() {
    if (!this.moving) {
      return;
    }
    var s = this._speed();
    var f = (now().t - this.departureTime)%s;
    return f/s;
  }

  // interpolate position on the current path segment
  _interpolateCurrentPosition() {

    if (!this.moving) {
      return;
    }
    var r = this._getInterTilesPosition();

    var x = (1-r)*this.startPos.x;
    var y = (1-r)*this.startPos.y;

    if (this.endPos) {
      x += r*this.endPos.x;
      y += r*this.endPos.y;          
    } else {
      x += r*this.destinationBuilding.tile.center.x;
      y += r*this.destinationBuilding.tile.center.y;  
    }
    
    this.movingPosition.x=x;
    this.movingPosition.y=y
    return this.movingPosition;
  }

  draw() {
    if (!this.moving) {
      return;
    }
    fill(this.getColor());    
    circle(this.movingPosition.x, this.movingPosition.y, this.size);

    this._billieJean();
  }

  _billieJean() {
    if (this.isMichael) {
      if (this.cTile) {
        this.cTile.selected=false;
      }
      this.cTile = this.getCurrentTile();
      this.cTile.selected=true;
    }
  }

  getHealthState() {
    return this.health;
  }

  wasInfectious() {
    if (this.virus) {
      return this.virus.getStage()>0;
    }
    return false;
  }

  isInfectious() {
    if(this.isDead()) return false;
    return (this.health> HealthState.INCUBATION) && (this.health <HealthState.RECOVERED);
  }

  isSick() {
    return this.health==HealthState.SICK;
  }

  isRecovered() {
    return this.health==HealthState.RECOVERED;  
  }

  isDead() {
    return this.health==HealthState.DEAD;
  }

  needsICU() {
    return this.isSick() && this.virus.isSevereForm();
  }

}

