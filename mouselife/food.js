class Food {

    constructor(space, size, x, y) {

        if (x===undefined || y===undefined) {
            this.pos = createVector(Math.round(space.w * Math.random(1)),Math.round(space.h*Math.random(1)));    
        } else {
            this.pos = createVector(Math.round(x),Math.round(y));
        }


        if (size===undefined) {
            this.size = Math.round(5+Math.random(1)*20);
        } else {
            this.size = size;
        }        

        this.space = space;

        this.eaten=false;

        this.holes = [];

        var nbHoles = Math.round(1+ Math.random()*4);
        for (var i = 0; i < nbHoles; i++) {
            this.holes.push({ x : Math.round(this.size*0.5*(-1 + 2*Math.random())),
                y : Math.round(this.size*0.5*(-1 + 2*Math.random())),
                r : Math.round(this.size*(0.1  + 0.15*Math.random()))
            });
        }

    }
    
    eat() {
        this.eaten=true;
    }

    draw() {
        if (this.eaten) {
            return;
        }

        fill(color(255,216,103));
        noStroke();
        circle(this.pos.x,this.pos.y,this.size/2);
        
        fill(color(255,255,255));
        for (var i = 0; i < this.holes.length; i++) {
            var hole = this.holes[i];
            circle(this.pos.x+ hole.x,this.pos.y+ hole.y, hole.r);
        }
    }
}