function initTileSet(tileWidth, WX, WY) {
    tiles=[];
    tiles.tileWidth = tileWidth;
    tiles.WX=WX;
    tiles.WY=WY;
  }
  
function initCityLayout() {

    var tw = 40;
    var roadX=8;
    var roadY=3;
  
    initTileSet(tw, Math.floor(w/tw), Math.floor(h/tw));
  
    for (var i = 0; i <= tiles.WX; i++) {
      for (var j = 0; j <= tiles.WY; j++) {
        var t = new Tile(createVector(i,j), tw);
        if (i%roadX!=0 && j%roadY!=0) {
          var p = Math.random()*100;
  
          //  55 => houses
          //  10 => shops
          //  15 => company
          //  05 => schools
          //  01 => hospital
          //  01 => park
          //  02 => venue
          //  10 => restaurant
  
          var btype=BType.HOUSE;
          var n = 1;
          if (p < 55) {
            btype=BType.HOUSE;
            n=1+ Math.round(Math.random()*1.6);
          } else if (p < 65) {
            btype=BType.SHOP;
            n=1+ Math.round(Math.random()*1);
          } else if (p < 80) {
            btype=BType.COMPANY;
            n=1+ Math.round(Math.random()*1);
          } else if (p < 85) {
            btype=BType.SCHOOL;
            n=1;
          } else if (p < 86) {
            btype=BType.HOSPITAL;
            n=1;
          } else if (p < 87) {
            btype=BType.PARK;
            n=1;
          } else if (p < 90) {
            btype=BType.VENUE;
            n=1;
          } else if (p <= 100) {
            btype=BType.RESTAURANT;
            n=1;
          }
  
          for (var idx = 0; idx < n; idx++) {
            var b = new Building(t, btype);
            b.idx = idx;
            t.deploy(b);
          }        
        }
      }
    }
  }
  
function drawCity() {
    if (!paused) {
      for (var t =0; t < tiles.length; t++) {
        tiles[t].resetTravelers();
      }  
      for (var p =0; p < people.length; p++) {
        people[p].update();
      }
    }
  
    for (var t =0; t < tiles.length; t++) {
      tiles[t].draw();
      if (!paused) tiles[t].positionTraverlers();
    }  
  
    for (var p =0; p < people.length; p++) {
      if (!paused) people[p].position();
      people[p].draw();
    }  
}
  