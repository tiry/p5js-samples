
var tiles=[];
tiles.tileWidth=20;
tiles.WX=20;
tiles.WY=20;

var buildings=[];

var people=[];

function getTile(x,y) {  
  var idx = x*(tiles.WY+1)+y;
  var t=tiles[idx];
  if (t==undefined) {
    throw "No tile found for " + x + ',' + y + ' idx=' + idx;
  }
  return t;
}

function findTile(px, py) {
  for (var i =0; i < tiles.length; i++) {
    if ((px > tiles[i].center.x*tiles.tileWidth) && (px <= (tiles[i].center.x+1)*tiles.tileWidth)) {
      if ((py > tiles[i].center.y*tiles.tileWidth) && (py <= (tiles[i].center.y+1)*tiles.tileWidth)) {
        return tiles[i];
      }
    }    
  }  
  throw ("Unable to find tile for ", px, py);
  return null;
}

//**************************

function initTileSet(tileWidth, WX, WY) {
  tiles=[];
  tiles.tileWidth = tileWidth;
  tiles.WX=WX;
  tiles.WY=WY;
}

class Tile {

    constructor(center,width) {
      this.center = center;
      this.width = width;
      tiles.push(this);
      this.children = [];
      this.selected = false;
      this.travelers = [];
      this.travelersNext = [];
    }

    draw() {      
      if (this.selected) {
        strokeWeight(2)
        stroke(color(255,0,0));
      } else {        
        stroke(color(0,0,0));
      }
      if (this.children.length==0 || this.selected) {
        fill(color(220,220,220));
        strokeWeight(0)
        square(this.center.x*this.width, this.center.y*this.width, this.width, 0);
      } else {
        for (var c=0; c < this.children.length; c++) {
          this.children[c].draw();
        }
      }
      strokeWeight(1)
    }

    deploy(b) {
      this.children.push(b);
    }

    isEmpty() {
      return this.children.length==0;
    }

    toogleSelected() {
      this.selected=!this.selected;
    }

    resetTravelers() {
      this.travelers = [];
      this.travelersNext = [];
    }

    positionTraverlers() {
      this._dispath(this.travelers, true);
      this._dispath(this.travelersNext, false);
    }

    _dispath(crowd, start) {
      var lines = computeLayout(crowd.length);
      var idx = 0;
      var dy = Math.floor(tiles.tileWidth/(lines.length+1));
      var dx = 0;

      var y = this.center.y*this.width;
      var x = 0;

      for (var l=0; l < lines.length; l++) {
        y += dy;
        dx = Math.floor(tiles.tileWidth/(lines[l]+1));
        x=this.center.x*this.width;        
        for (var i=0; i < lines[l]; i++) {
          x+=dx;
          crowd[idx].setPosition(x,y,start);
          idx++;
        }
      }
    }

    getNeighborhood(radius) {
      var neighborhood=[];
      var cx = this.center.x;
      var cy = this.center.y;
      for (var r=1; r <=radius; r++) {

        for (var x=cx-r+1; x <=cx+r-1; x++) {
          try {neighborhood.push(getTile(x,cy+r))} catch(e){};
          try {neighborhood.push(getTile(x,cy-r))} catch(e){};
        } 
        for (var y=cy-r; y <=cy+r; y++) {
          try {neighborhood.push(getTile(cx-r,y))} catch(e){};
          try {neighborhood.push(getTile(cx+r,y))} catch(e){};
        }
      }
      return neighborhood;
    }
}

function computeLayout(n) {
  if (n==0) {
    return [];
  }
  var x = 1;
  var y = 1;
  var i = 0;
  while( x*y < n) {
    i++;
    if (i%2==0) {
      x++;
    } else {
      y++;
    }
  }
  var slots = x*y;
  var lines = [];
  for (var l=0; l < y; l++) {
    lines.push(x);
  }
  i=1;
  while (slots > n) {
    lines[i]-=1;
    i = (i +2) % lines.length;
    slots=0;
    for (var l=0; l < lines.length; l++) {
      slots+=lines[l];
    }
  }
  return lines;
}

//**************************

const BType =  {

  HOUSE: 'house',
  SCHOOL: 'school',
  SHOP: 'shop',
  COMPANY: 'compamny',
  HOSPITAL: 'hospital',
  VENUE: 'venue',
  RESTAURANT: 'restaurant'
}

class Building {

  constructor(tile, type) {
    this.tile = tile;
    buildings.push(this);
    tile.children.push(this);
    this.people=[];    
    this.type=type;
    this.capacity=this._computeCapacity();   
    this.idx=0;     
  }

  _computeCapacity() {

    var base=0;
    var amplitude = 0;

    switch(this.type){

      case BType.HOUSE:
        base = 2;
        amplitude=6;
      case BType.SCHOOL:
        base = 10;
        amplitude=400;
      case BType.SHOP:
        base = 1;
        amplitude=50;
      case BType.COMPANY:
        base = 2;
        amplitude=200;
      case BType.HOSPITAL:
        base = 10;
        amplitude=300;      
      case BType.VENUE:
        base = 10;
        amplitude=200;      
      case BType.RESTAURANT:
        base = 2;
        amplitude=20;           
    }

    return  base+ Math.round(Math.random()*amplitude);
  }

  _getColor() {

    switch(this.type){
      case BType.HOUSE:
        return color(160,82,45)
      case BType.SCHOOL:
        return color(204, 191, 92)
      case BType.SHOP:
        return color(70, 138, 137)
      case BType.COMPANY:
        return color(124, 130, 118)
      case BType.HOSPITAL:
        return color(230, 232, 227)
      case BType.VENUE:
        return color(207, 158, 230)
      case BType.RESTAURANT: 
        return color(212, 167, 116) 
    }
  }

  draw() {
    fill(this._getColor());
    var bwidth = 2*this.tile.width/this.tile.children.length;
    var x = this.tile.center.x*this.tile.width + this.idx*bwidth;
    var y = this.tile.center.y*this.tile.width;
    rect(x, y, bwidth, this.tile.width,5);

    if (this.people.length>0) {

      var lines = computeLayout(this.people.length);
      var idx=0;
      var dy = this.tile.width/(lines.length+1);
      var ly = y+dy;  
      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        var dx = bwidth/(l+1);
        for (var j = 0; j < l; j++) {
          if (!this.people[idx].moving) {
            fill(this.people[idx].getColor())
            circle(x+(j+1)*dx, ly, this.people[idx].size);
          }
          idx++;
        }
        ly+=dy;
      }
    }

  }

}

//**************************

var PEOPLE_BASE_SPEED = 1;

class Person {

  constructor(home, age) {
    this.age = age;
    this.home = home;
    this.currentLocation = home;
    this.departureTime=0;
    this.moving=false;

    people.push(this);
    home.people.push(this);
    this.speedFactor=PEOPLE_BASE_SPEED *(2 - age/100); 

    this._assignWork();
    this.schedule = new Schedule(this);
    
    this.size = 8;
    if (age < 14) {
      this.size = this.size*0.8;
    }

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

  setTarget(destinationBuilding) {
    this.departureTime=frameCount;
    this.destinationBuilding = destinationBuilding;
    var dest = destinationBuilding.tile;
    this.path = this.computePath(dest);
    this.moving=true;
  }

  _speed() {
    return Math.floor(fr/this.speedFactor);
  }

  update() {
    if (this.moving) {
      var f = frameCount - this.departureTime;
      if (this.startPos == null || f%(this._speed())==0) {
        var step = Math.floor(f/(this._speed()));
        if (step < this.path.length) {
          getTile(this.path[step].x, this.path[step].y).travelers.push(this);
          if (step+1 < this.path.length) {
            getTile(this.path[step+1].x, this.path[step+1].y).travelersNext.push(this);
          } else {
            this.destinationBuilding.tile.travelersNext.push(this);
          }
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

  setLocation(building) {
    if (this.currentLocation) {
      this.currentLocation.people = this.currentLocation.people.filter(function (v, i, a){return !v===this});
      this.currentLocation = building;
      building.people.push(this);
    }    
  }

  setPosition(x,y,start) {
    if (start) {
      this.startPos = {x: x, y: y};
    } else {
      this.endPos = {x: x, y: y};
    }
  }

  getColor() {
    if (this.age < 20) {
      return color(0,200,200);
    } else if (this.age < 65) {
      return color(0,0,200);
    } else {
      return color(0,0,130);
    }  
  }

  draw() {
    var interpolate = true;
    if (!this.moving) {
      return;
    }

    fill(this.getColor());
    
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
    circle(x, y, this.size);
  }

}



