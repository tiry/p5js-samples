
var tiles=[];
tiles.tileWidth=20;
tiles.WX=20;
tiles.WY=20;

var buildings=[];

function getTile(x,y) {  
  return tiles[x*(tiles.WY+1)+y];
}

function findTile(px, py) {
  for (var i =0; i < tiles.length; i++) {
    if ((px > tiles[i].center.x*tiles.tileWidth) && (px <= (tiles[i].center.x+1)*tiles.tileWidth)) {
      if ((py > tiles[i].center.y*tiles.tileWidth) && (py <= (tiles[i].center.y+1)*tiles.tileWidth)) {
        return tiles[i];
      }
    }    
  }  
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
      this.children=[];
      this.road=false;
      this.selected=false;
    }

    draw() {      
      if (this.selected) {
        stroke(color(255,0,0));
      } else {
        stroke(color(0,0,0));
      }
      if (this.children.length==0) {
        fill(color(220,220,220));
        square(this.center.x*this.width, this.center.y*this.width, this.width, 5);
      } else {
        fill(color(80,80,80));
        square(this.center.x*this.width, this.center.y*this.width, this.width, 5);
        for (var c=0; c < this.children.length; c++) {
          this.children[c].draw();
        }
      }
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

  
}

//**************************

const BType =  {

  HOUSE: 'house',
  SCHOOL: 'school',
  SHOP: 'shop',
  COMPANY: 'compamny',
  HOSPITAL: 'hospital'
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
        amplitude=100;      
    }
    return  base+ Math.round(Math.random()*amplitude);
  }

  _getColor() {

    switch(this.type){
      case BType.HOUSE:
        return color(100,200,50)
      case BType.SCHOOL:
        return color(200,200,0)
      case BType.SHOP:
        return color(0,200,200)
      case BType.COMPANY:
        return color(0,0,200)
      case BType.HOSPITAL:
        return color(200,0,0)
    }
  }

  draw() {
    fill(this._getColor());
    var bwidth = 2*this.tile.width/this.tile.children.length;
    var x = this.tile.center.x*this.tile.width + this.idx*bwidth;
    var y = this.tile.center.y*this.tile.width;
    rect(x, y, bwidth, this.tile.width,5);
  }

}

//**************************

class Person {

  constructor(home, age) {
    this.age = age;
    this.home = home;
  }

  _findExit(cx,cy) {
    // find exit;
    if (cy-1>=0 && getTile(cx,cy-1).isEmpty()) {
      return {x: cx, y: cy-1};
    }
    else if (cy+1< tiles.WY && getTile(cx,cy+1).isEmpty()) {
      return {x: cx, y: cy+1};
    }
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

    var cx = this.home.center.x;
    var cy = this.home.center.y;

    // find exit;
    var start = this._findExit(cx,cy);
    path.push(start);
    
    // find entry point;
    var end = this._findExit(dest.center.x,dest.center.y);    


    this._walk(start, end, path);
    path.push(end);

    return path;
  }

}



