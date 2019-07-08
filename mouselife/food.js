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

    }
    
    eat() {
        this.eaten=true;
    }

    draw() {
        if (this.eaten) {
            return;
        }

        fill(color(200,200,0));
        noStroke();
        rect(this.pos.x,this.pos.y,this.size,this.size);
    }
}